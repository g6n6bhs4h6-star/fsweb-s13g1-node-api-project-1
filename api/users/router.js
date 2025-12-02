const express = require('express');
const Users = require('./model.js');

const router = express.Router();

// POST /api/users - Yeni kullanıcı oluştur
router.post('/', async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    
    // Validasyon
    if (!name || !bio) {
      return res.status(400).json({ 
        message: 'Lütfen kullanıcı için bir name ve bio sağlayın' 
      });
    }
    
    // Yeni kullanıcı oluştur
    const newUser = await Users.insert({ name, bio });
    
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// GET /api/users - Tüm kullanıcıları getir
router.get('/', async (req, res, next) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

// GET /api/users/:id - Belirli kullanıcıyı getir
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id);
    
    if (!user) {
      return res.status(404).json({ 
        message: 'Belirtilen ID\'li kullanıcı bulunamadı' 
      });
    }
    
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/users/:id - Kullanıcıyı sil
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedUser = await Users.remove(id);
    
    if (!deletedUser) {
      return res.status(404).json({ 
        message: 'Belirtilen ID\'li kullanıcı bulunamadı' 
      });
    }
    
    res.status(200).json(deletedUser);
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/:id - Kullanıcıyı güncelle
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, bio } = req.body;
    
    // Kullanıcı var mı kontrol et
    const existingUser = await Users.findById(id);
    if (!existingUser) {
      return res.status(404).json({ 
        message: 'Belirtilen ID\'li kullanıcı bulunamadı' 
      });
    }
    
    // Validasyon
    if (!name || !bio) {
      return res.status(400).json({ 
        message: 'Lütfen kullanıcı için name ve bio sağlayın' 
      });
    }
    
    // Kullanıcıyı güncelle
    const updatedUser = await Users.update(id, { name, bio });
    
    if (!updatedUser) {
      return res.status(500).json({ 
        message: 'Kullanıcı bilgileri güncellenemedi' 
      });
    }
    
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

// Hata yönetimi middleware'i
router.use((err, req, res, next) => {
  console.error('Users router error:', err);
  
  if (err.message && err.message.includes('database')) {
    return res.status(500).json({ 
      message: 'Veritabanına kaydedilirken bir hata oluştu' 
    });
  }
  
  res.status(500).json({ 
    message: 'Kullanıcı bilgileri alınamadı' 
  });
});

module.exports = router;