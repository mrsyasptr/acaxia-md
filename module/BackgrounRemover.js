const { Image } = require('image-js');

// Menghapus latar belakang sebuah foto
async function removeBackground(imagePath, outputPath) {
  // Membaca gambar asli
  const originalImage = await Image.load(imagePath);

  // Mendapatkan piksel-piksel yang berbeda dengan latar belakang
  const mask = await originalImage.grey().mask({ threshold: 50 });

  // Memisahkan latar belakang dan objek
  const background = await originalImage.background(mask);
  const object = await originalImage.extract(mask);

  // Menggabungkan objek dengan latar belakang transparan
  const result = new Image(object.width, object.height, { alpha: 1 });
  await result.setAlpha(mask);
  await result.blit(background, { alpha: 0 });
  await result.blit(object);

  // Menyimpan gambar hasil tanpa latar belakang
  await result.save(outputPath);

  console.log('Latar belakang berhasil dihapus!');
}

// Memanggil fungsi removeBackground
removeBackground('path/to/image.jpg', 'path/to/output.png');
