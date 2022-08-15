import PausableSuperStepController from "./PausableSuperStepController";

export default function makeStepAsyncGenerator(
  interval_ms = 500
): AsyncGenerator<number> {
  const contoller = new PausableSuperStepController(interval_ms);

  contoller.play();

  return contoller.makeStepGenerator();
}
