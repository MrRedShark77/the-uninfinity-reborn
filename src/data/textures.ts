export const texturesURL = import.meta.glob('@assets/textures/*.{png,jpg,jpeg,PNG,JPEG}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>

// console.log(texturesURL)

export const generatorTextures = ['', ...new Array(10).fill('').map((_,i) => `/src/assets/textures/generator-${i+1}.png`).map(x => texturesURL[x])]
export const infinityGeneratorTextures = ['', ...new Array(10).fill('').map((_,i) => `/src/assets/textures/inf-generator-${i+1}.png`).map(x => texturesURL[x])]

// console.log(generatorTextures)
