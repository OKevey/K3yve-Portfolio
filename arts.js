/* =============================================
   KRFT PORTFOLIO — arts.js
   
   Como usar:
   1. Coloque a imagem na pasta /arts/
   2. Adicione uma entrada nesta lista abaixo
   3. Salve e faça push para o GitHub — aparece automaticamente!

   Campos:
   - id:          identificador único (sem espaços, sem acento)
   - file:        caminho da imagem dentro da pasta arts/
   - name:        nome que aparece na galeria e no lightbox
   - description: texto que aparece ao passar o mouse e no lightbox
   - category:    categoria para filtrar (ex: 'Artes 2025', 'Flyers', 'Covers')
   - featured:    posição no pódio: 1, 2 ou 3. Use null para não destacar.

   Exemplo de entrada:
   {
     id:          'minha-arte',
     file:        'arts/minha-arte.jpg',
     name:        'Nome da Arte',
     description: 'Descrição desta arte.',
     category:    'Artes 2025',
     featured:    null
   },
   ============================================= */

const ARTS = [

  // ↓ ADICIONE SUAS ARTES AQUI ↓

  // {
  //   id:          'exemplo-01',
  //   file:        'arts/exemplo-01.jpg',
  //   name:        'Exemplo 01',
  //   description: 'Descrição da arte exemplo.',
  //   category:    'Artes 2025',
  //   featured:    1
  // },

];

/* =============================================
   CONFIGURAÇÕES GERAIS
   Edite os textos do portfólio aqui.
   ============================================= */
const CONFIG = {
  name:     'KRFT.',                  // Nome/logo no header e footer
  tagline:  'Artes que falam por si. Covers, flyers e identidade visual com pegada streetwear.',
  about:    'Escreva aqui sobre você e seu trabalho. Fale sobre sua trajetória, estilo e inspirações.',
};
