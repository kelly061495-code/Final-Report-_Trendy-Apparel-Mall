// 模擬產品資料 (對應 .agent/knowledge/products.md)
export const products = [
    { id: 'P001', name: '經典重磅素色短T', category: '上衣', price: 590, stock: 100, desc: '高磅數棉質，透氣舒適，百搭基本款。', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: 'P002', name: '復古水洗直筒牛仔褲', category: '褲裝', price: 1280, stock: 50, desc: '獨特水洗工藝，修身直筒剪裁。', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: 'P003', name: '街頭風寬版連帽外套', category: '外套', price: 1580, stock: 30, desc: '防風防潑水材質，街頭穿搭必備。', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: 'P004', name: '簡約工裝短褲', category: '褲裝', price: 890, stock: 80, desc: '多口袋設計，實用且具立體感。', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: 'P005', name: '日系落肩長袖襯衫', category: '上衣', price: 980, stock: 60, desc: '輕薄透氣，寬鬆落肩版型，展現慵懶風格。', image: 'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { id: 'P006', name: '羊毛混紡針織毛衣', category: '上衣', price: 1450, stock: 40, desc: '保暖親膚，適合秋冬內搭或單穿。', image: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
];

export const Storage = {
    get: (key) => JSON.parse(localStorage.getItem(key) || 'null'),
    set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
    remove: (key) => localStorage.removeItem(key)
};

// 防呆驗證工具 (對應 .agent/rules/validation.md)
export const Validators = {
    isNumber: (val) => !isNaN(val) && Number.isInteger(Number(val)),
    isValidQuantity: (qty, stock) => {
        if (!Validators.isNumber(qty)) return { valid: false, msg: '數量必須為純數字' };
        qty = Number(qty);
        if (qty < 1) return { valid: false, msg: '數量必須大於 0' };
        if (qty > stock) return { valid: false, msg: `數量不得超過庫存 (${stock})` };
        return { valid: true };
    },
    isValidPhone: (phone) => /^09\d{8}$/.test(phone),
    isValidPassword: (pwd) => pwd.length >= 6,
    isValidUsername: (user) => user.length >= 4
};
