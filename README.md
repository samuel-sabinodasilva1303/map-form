# Map Form

Map Form é uma aplicação web desenvolvida para permitir que usuários desenhem e gerenciem formas em um mapa utilizando a Google Maps JavaScript API. A aplicação exibe formas no mapa, permitindo salvar e visualizar um histórico das formas desenhadas.

## Tecnologias Utilizadas

- **Vue.js** - Framework para construção da interface do usuário.
- **Vite** - Ferramenta de construção e desenvolvimento rápido.
- **Google Maps JavaScript API** - API do Google para integração de mapas.
- **CSS** - Para estilização da aplicação.

## Instalação

Para rodar o projeto localmente, siga os passos abaixo:

1. Navegue para o diretório do projeto:
    ```bash
    cd map-form
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Configure a chave da API do Google Maps:
   - Crie um arquivo `.env` na raiz do projeto e adicione a seguinte linha, substituindo `"YOUR_GOOGLE_MAPS_API_KEY"` pela sua chave da API:
     ```plaintext
     VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
     ```

## Scripts

- `npm run dev`: Inicia o servidor de desenvolvimento.

## Funcionalidades

- **Desenhar Formas**: Permite aos usuários desenhar retângulos e polígonos no mapa.
- **Salvar Formas**: As formas desenhadas podem ser salvas e exibidas em uma lista ao lado do mapa.
- **Remover Formas**: Os usuários podem remover formas do mapa e da lista de formas salvas.

## Acessar a Aplicação

A aplicação pode ser acessada através do seguinte link: [Map Form](https://samuel-sabinodasilva1303.github.io/map-form/)

## Clonando o Repositório

Para clonar este repositório, você pode usar o seguinte comando:

```bash
git clone https://github.com/samuel-sabinodasilva1303/map-form.git
