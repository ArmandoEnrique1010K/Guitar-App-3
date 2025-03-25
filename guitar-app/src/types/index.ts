export type Notes = {
  rope: number
  frets: Frets
}[]

export type Frets = {
  chord: number
  file: string
  key?: string
}[]