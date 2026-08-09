export interface IMapper<Input, Output> {
  map(input: Input, tipoContribuyente?: number): Output;
}
