document.getElementById('imageForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const width = document.getElementById('width').value;
  const height = document.getElementById('height').value;
  const quantity = document.getElementById('quantity').value;

  const imageGrid = document.getElementById('imageGrid');
  imageGrid.innerHTML = '';  

  for (let i = 0; i < quantity; i++) {
      const imageUrl = `https://picsum.photos/${width}/${height}.webp`;
      const imageContainer = document.createElement('div');

      imageContainer.innerHTML = `
          <img src="${imageUrl}" alt="Imagem aleatória de ${width}x${height}">
          <div class="action-links">
              <a href="${imageUrl}" download="imagem-${i+1}.webp">Baixar</a>
              <button onclick="copyLink('${imageUrl}')">Copiar Link</button>
          </div>
      `;

      imageGrid.appendChild(imageContainer);
  }
});

function copyLink(link) {
  navigator.clipboard.writeText(link).then(() => {
      alert('Link copiado com sucesso!');
  }).catch(() => {
      alert('Falha ao copiar o link.');
  });
}
