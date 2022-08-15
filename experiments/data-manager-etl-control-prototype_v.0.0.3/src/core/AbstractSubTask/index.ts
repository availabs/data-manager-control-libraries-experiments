import {
  EtlContext,
  TaskContext,
  SubTaskClass,
  SubTaskStatus,
  SubTaskI,
  TaskName,
} from "../../types";

export default abstract class MockAbstractSubTask implements SubTaskI {
  readonly name: string;

  private _status: SubTaskStatus;
  private _dependencies: Record<TaskName, SubTaskI>;

  readonly doneData: any | null;

  constructor(etlContext: EtlContext) {
    const clazz = <SubTaskClass>this.constructor;

    this.name = clazz.name;

    // If the etlTask is already done, we are resuming a task after it finished.
    if (etlContext.etlTasks[clazz.name]?.status === SubTaskStatus.DONE) {
      this._status = SubTaskStatus.DONE;

      this._dependencies = {};

      this.doneData = etlContext.etlTasks[clazz.name].doneData;

      return;
    }

    this.doneData = null;

    this._dependencies = {};

    const taskDependencies = clazz.taskDependencies?.filter(Boolean);
    console.log(
      JSON.stringify(
        {
          className: clazz.name,
          taskDependencies: clazz.taskDependencies?.map((d) => d?.name),
        },
        null,
        4
      )
    );

    this._status = SubTaskStatus.AWAITING;

    if (taskDependencies) {
      for (const depClazz of taskDependencies) {
        this._dependencies[depClazz.name] =
          etlContext.spawnDependency(depClazz);
      }

      if (
        Object.keys(this._dependencies).every(
          (name) => this._dependencies[name].status === SubTaskStatus.DONE
        )
      ) {
        this._status = SubTaskStatus.READY;
      }
    } else {
      this._status = SubTaskStatus.READY;
    }

    const taskMain = this.main.bind(this);

    const proxy = async function proxy(...args: any[]) {
      if (this.status === SubTaskStatus.DONE) {
        throw new Error("Cannot call Task.main after Task is done.");
      }

      this._status = SubTaskStatus.PENDING;

      console.log("Called main:", this.name);

      this.doneData = await taskMain(...args);

      this._status = SubTaskStatus.DONE;

      return this.doneData;
    };

    this.main = proxy.bind(this);
  }

  get status() {
    if (this._status === SubTaskStatus.AWAITING) {
      if (
        Object.values(this._dependencies).every(
          (t) => t.status === SubTaskStatus.DONE
        )
      ) {
        this._status = SubTaskStatus.READY;
      }
    }

    // console.log("==>", this.constructor.name, "get status:", this._status);

    return this._status;
  }

  abstract main(context: TaskContext): Promise<any>;
}
