# Paint do Wands

[Paint do Wands - Live Demo](https://paint-do-wands.vercel.app/)

Paint do Wands é um aplicativo web interativo desenvolvido para a disciplina de Computação Gráfica. O projeto demonstra a implementação de algoritmos clássicos de transformação geométrica, rasterização e recorte, permitindo que o usuário crie, modifique e manipule formas 2D diretamente em um canvas.

## Funcionalidades

### Transformações Geométricas 2D
- **Translação:** Deslocamento das formas conforme valores informados pelo usuário.
- **Rotação:** Rotaciona formas em torno de um ponto de referência.
- **Escala:** Altera o tamanho das formas com fatores de escala definidos pelo usuário.
- **Reflexões:** Suporte para reflexões nos eixos X, Y e na diagonal XY, utilizando fatores informados pelo usuário (sem valores fixos).

### Rasterização
- **Retas:** Implementação dos algoritmos DDA e Bresenham para a rasterização de linhas.
- **Circunferência:** Rasterização de círculos utilizando o algoritmo de Bresenham.

### Recorte
- **Cohen-Sutherland:** Recorte de linhas utilizando a codificação de regiões.
- **Liang-Barsky:** Recorte de linhas utilizando a equação paramétrica.

## Tecnologias Utilizadas

- **React:** Biblioteca para construção da interface do usuário.
- **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
- **HTML5 Canvas:** Elemento HTML para renderização de gráficos 2D.
- **DaisyUI:** Biblioteca gráfica para construção da interface e componentes.

## Como Utilizar

1. Acesse a [Live Demo](https://paint-do-wands.vercel.app/).
2. Selecione o modo desejado (por exemplo, desenhar retas, círculos, polígonos ou aplicar recorte).
3. Insira os valores de transformação ou recorte conforme solicitado pela interface.
4. Interaja com o canvas para desenhar e manipular as formas.
5. Utilize as ferramentas de transformação para aplicar translação, rotação, escala e reflexões nas formas desenhadas.

## Créditos
Este projeto foi desenvolvido para a disciplina de Computação Gráfica e implementa algoritmos clássicos, incluindo:

- Transformações geométricas 2D (translação, rotação, escala e reflexões X/Y/XY);
- Algoritmos de rasterização para retas (DDA e Bresenham) e circunferências (Bresenham);
- Técnicas de recorte, utilizando Cohen-Sutherland e Liang-Barsky;

Contribuições, sugestões e melhorias são sempre bem-vindas!
