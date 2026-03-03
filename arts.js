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


   {
      id:          '1',
      file:        'arts/MONTAGEM, XONADA.png',
      name:        'MONTAGEM XONADA',
      description: 'Art made for DJ Javi26, MXZI, Dj Samir | Lunar media',
      category:    '2025 ARTS',
      featured:    1
   },

  {
      id:          '2',
      file:        'arts/MONTAGEM, LADRAO.png',
      name:        'MONTAGEM LADRÃO',
      description: 'Art made For ATLXS, MXZI | Rubix Records',
      category:    '2025 ARTS',
      featured:    2
   },

  {
      id:          '3',
      file:        'arts/MONTAGEM, SUPERSONIC.png',
      name:        'MONTAGEM SUPERSONIC',
      description: 'Art made For KHAOS, Jmilton, Mc jajá | Rubix Records',
      category:    '2025 ARTS',
      featured:    3
   },

];

/* =============================================
   CONFIGURAÇÕES GERAIS
   Edite os textos do portfólio aqui.
   ============================================= */
const CONFIG = {
  name:     'K3Y.',                  // Nome/logo no header e footer
  tagline:  'All rights Reserved.',
  about:    'DJ K3YVE is a Brazilian DJ and music producer known for blending funk with modern electronic influences. His sound explores energetic rhythms, heavy basslines and catchy melodies, creating tracks that feel raw. \n\nK3YVE is also a Cover-art designer, working specially for Rubix Records™ and Selected Artists, such as "DJ Javi26".\n\nHis arts travels around all the world, Being a Inspiration to people and going through worldwide hits.',
};
