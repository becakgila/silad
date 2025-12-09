const progressToNumber: any = {
  prodi: 1,
  fakultas: 2,
  universitas: 3
}

const numberToProgress: {
  [key: string]: string;
} = {
  1: 'prodi',
  2: 'fakultas',
  3: 'universitas'
}

export { numberToProgress, progressToNumber };        