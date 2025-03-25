export type Neck = {
  rope: number
  frets: Frets
}[]

export type Frets = {
  chord: number
  file: string
  key?: string
}[]