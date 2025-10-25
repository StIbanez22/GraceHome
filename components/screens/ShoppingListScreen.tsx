import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { ShoppingListItem } from '../../types';
import Icon from '../common/Icon';

const ShoppingListScreen: React.FC = () => {
    const { t } = useApp();
    const [items, setItems] = useState<ShoppingListItem[]>([
        { id: '1', name: 'Milk', quantity: 2, category: 'Dairy', purchased: false },
        { id: '2', name: 'Bread', quantity: 1, category: 'Bakery', purchased: false },
        { id: '3', name: 'Apples', quantity: 6, category: 'Produce', purchased: true },
    ]);
    const [newItemName, setNewItemName] = useState('');
    const [newItemQty, setNewItemQty] = useState(1);
    
    const [editingItem, setEditingItem] = useState<ShoppingListItem | null>(null);

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemName.trim()) return;
        const newItem: ShoppingListItem = {
            id: Date.now().toString(),
            name: newItemName,
            quantity: newItemQty,
            category: 'General',
            purchased: false,
        };
        setItems([...items, newItem]);
        setNewItemName('');
        setNewItemQty(1);
    };

    const togglePurchased = (id: string) => {
        setItems(items.map(item => item.id === id ? { ...item, purchased: !item.purchased } : item));
    };
    
    const handleEditItem = (item: ShoppingListItem) => {
        setEditingItem({ ...item });
    };

    const handleCancelEditItem = () => {
        setEditingItem(null);
    };

    const handleSaveEditItem = () => {
        if (!editingItem) return;
        setItems(items.map(item => item.id === editingItem.id ? editingItem : item));
        setEditingItem(null);
    };

    const handleEditItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editingItem) return;
        const { name, value } = e.target;
        setEditingItem({
            ...editingItem,
            [name]: name === 'quantity' ? parseInt(value, 10) || 1 : value,
        });
    };

    const activeItems = items.filter(item => !item.purchased);
    const purchasedItems = items.filter(item => item.purchased);

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t('shopping')}</h1>
            </header>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-4 mb-6">
                    <input
                        type="text"
                        placeholder={t('item_name')}
                        value={newItemName}
                        onChange={e => setNewItemName(e.target.value)}
                        className="flex-grow px-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                        type="number"
                        min="1"
                        value={newItemQty}
                        onChange={e => setNewItemQty(parseInt(e.target.value, 10))}
                        className="w-24 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-transparent rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition">{t('add_to_list')}</button>
                </form>

                <ul className="space-y-3">
                    {activeItems.map(item => (
                        <li key={item.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-all duration-300">
                            {editingItem && editingItem.id === item.id ? (
                                <div className="flex-grow flex items-center gap-2">
                                     <input type="checkbox" checked={item.purchased} disabled className="h-5 w-5 rounded border-gray-300" />
                                     <input 
                                         type="text"
                                         name="name"
                                         value={editingItem.name}
                                         onChange={handleEditItemChange}
                                         className="flex-grow px-2 py-1 bg-white dark:bg-gray-800 border-gray-300 rounded-md"
                                     />
                                     <input
                                        type="number"
                                        name="quantity"
                                        min="1"
                                        value={editingItem.quantity}
                                        onChange={handleEditItemChange}
                                        className="w-20 px-2 py-1 bg-white dark:bg-gray-800 border-gray-300 rounded-md"
                                    />
                                    <button onClick={handleSaveEditItem} className="p-1 text-green-500 hover:text-green-700"><Icon name="check" className="w-5 h-5"/></button>
                                    <button onClick={handleCancelEditItem} className="p-1 text-red-500 hover:text-red-700"><Icon name="x" className="w-5 h-5"/></button>
                                </div>
                            ) : (
                                <>
                                    <input type="checkbox" checked={item.purchased} onChange={() => togglePurchased(item.id)} className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="ml-4 flex-grow font-medium text-gray-800 dark:text-gray-200">{item.name}</span>
                                    <span className="text-gray-500 dark:text-gray-400 mr-4">Qty: {item.quantity}</span>
                                    <button onClick={() => handleEditItem(item)} className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">
                                        <Icon name="pencil" className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>

                {purchasedItems.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-4">{t('purchased_items')}</h2>
                        <ul className="space-y-3">
                            {purchasedItems.map(item => (
                                <li key={item.id} className="flex items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg opacity-60">
                                    <input type="checkbox" checked={item.purchased} onChange={() => togglePurchased(item.id)} className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <span className="ml-4 flex-grow font-medium text-gray-500 dark:text-gray-400 line-through">{item.name}</span>
                                    <span className="text-gray-400 dark:text-gray-500 line-through">Qty: {item.quantity}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingListScreen;