import React, { useState, useEffect } from 'react';
import SunnahFoodItem from '../components/SunnahFoodItem';
import { Search } from 'lucide-react';

const sunnahFoods = [
  {
    id: '1',
    title: 'Honey (ʿAsal)',
    description: 'A golden gift from nature, honey was treasured by the Prophet ﷺ for its sweetness and healing. It was used in food, drink, and medicine — a remedy from both heaven and earth.',
    benefits: [
      'Supports digestion',
      'Soothes the stomach',
      'Helps with wounds and infections',
      'Strengthens the heart',
      'Calms cough and boosts energy'
    ],
    sources: ['The Prophetic Medicine by Ibn Qayyim']
  },
  {
    id: '2',
    title: 'Barley / Talbina (Shaʿīr / Talbīnah)',
    description: 'Talbina is a soothing barley porridge made with barley flour, milk, and honey. The Prophet ﷺ recommended it to comfort the sick and ease sorrow.',
    benefits: [
      'Calms the heart',
      'Supports digestion',
      'Provides sustained energy',
      'Easy to digest during illness or grief'
    ],
    sources: ['The Prophetic Medicine by Ibn Qayyim']
  },
  {
    id: '3',
    title: 'Black Seed (Ḥabbatu al-Sawdā\')',
    description: 'Praised by the Prophet ﷺ as a healing seed for every illness except death. Small in size but vast in benefit.',
    benefits: [
      'Strengthens the immune system',
      'Fights inflammation',
      'Supports lungs and digestion',
      'Promotes overall health'
    ],
    sources: ['The Prophetic Medicine by Ibn Qayyim']
  },
  {
    id: '4',
    title: 'Olive & Olive Oil (Zayt & Zaytūn)',
    description: 'Called a blessed tree in the Qur\'an, olives and their oil were part of the Prophet\'s ﷺ nourishment and self-care.',
    benefits: [
      'Rich in good fats',
      'Supports heart and brain',
      'Calms inflammation',
      'Moisturises skin and hair'
    ],
    sources: ['The Prophetic Medicine by Ibn Qayyim']
  },
  {
    id: '5',
    title: 'Milk (Ḥalīb)',
    description: 'Pure and nourishing, milk was beloved by the Prophet ﷺ and seen as a symbol of sustenance and divine provision.',
    benefits: [
      'Strengthens bones',
      'Cools the body',
      'Aids growth and recovery',
      'Blends well with barley and honey for full nourishment'
    ],
    sources: ['The Prophetic Medicine by Ibn Qayyim']
  },
  {
    id: '6',
    title: 'Grapes (ʿInab)',
    description: 'A fruit of Paradise mentioned in the Qur\'an. Sweet, light, and energising — loved in fresh or dried form (raisins).',
    benefits: [
      'Hydrates',
      'Refreshes',
      'Supports liver and heart health',
      'Gently detoxifies the body'
    ],
    sources: ['The Prophetic Medicine by Ibn Qayyim']
  },
  {
    id: '7',
    title: 'Cucumber (Qiththā\')',
    description: 'Often eaten by the Prophet ﷺ with dates — a natural balance of cool and warm foods.',
    benefits: [
      'Cools the body',
      'Soothes the stomach',
      'Aids hydration',
      'Easy on digestion'
    ],
    sources: ['The Prophetic Medicine by Ibn Qayyim']
  },
  {
    id: '8',
    title: 'Watermelon (Baṭṭīkh)',
    description: 'Juicy and refreshing, watermelon was enjoyed with dates for its cooling effect and gentle sweetness.',
    benefits: [
      'Hydrating',
      'Calming',
      'Cleanses the body',
      'Supports digestion and skin health'
    ],
    sources: ['The Prophetic Medicine by Ibn Qayyim']
  },
  {
    id: '9',
    title: 'Pumpkin / Gourd (Qarʿ)',
    description: 'The Prophet ﷺ picked out pumpkin pieces from dishes. Soft and comforting, it\'s light on the stomach and heart.',
    benefits: [
      'Soothes the nerves',
      'Supports digestion',
      'Eases fever and restlessness',
      'Nourishes gently'
    ],
    sources: ['The Prophetic Medicine by Ibn Qayyim']
  },
  {
    id: '10',
    title: 'Melon (Shaammām)',
    description: 'A refreshing fruit ideal for warm climates. Soft, fragrant, and filled with natural hydration.',
    benefits: [
      'Hydrates the body',
      'Supports bladder and kidney function',
      'Refreshes after fasting or heat'
    ],
    sources: ['The Prophetic Medicine by Ibn Qayyim']
  },
  {
    id: '11',
    title: 'Dates (Tamr)',
    description: 'One of the most beloved foods of the Prophet ﷺ. Eaten daily and for breaking fasts, they are rich in sweetness and strength.',
    benefits: [
      'Boosts energy',
      'Improves digestion',
      'Supplies minerals',
      'Supports the body in fasting and recovery'
    ],
    sources: ['The Prophetic Medicine by Ibn Qayyim']
  },
  {
    id: '12',
    title: 'Figs (Tīn)',
    description: 'Mentioned in the Qur\'an, figs were known for their gentle sweetness and purifying effect.',
    benefits: [
      'Aids digestion',
      'Soothes the stomach',
      'Supports bowel health',
      'Strengthens the liver'
    ],
    sources: ['The Prophetic Medicine by Ibn Qayyim']
  },
  {
    id: '13',
    title: 'Pomegranate (Rummān)',
    description: 'A fruit of Paradise mentioned in the Qur\'an. Beautiful, nourishing, and rich in benefit.',
    benefits: [
      'Supports heart and blood health',
      'Strengthens immunity',
      'Offers natural cleansing'
    ],
    sources: ['The Prophetic Medicine by Ibn Qayyim']
  },
  {
    id: '14',
    title: 'Fish (Samak)',
    description: 'A light, clean food mentioned as permissible even without slaughter. Valued for nourishment and easy digestion.',
    benefits: [
      'High in protein',
      'Supports brain and eye health',
      'Reduces inflammation'
    ],
    sources: ['The Prophetic Medicine by Ibn Qayyim']
  },
  {
    id: '15',
    title: 'Garlic (Thūm)',
    description: 'While avoided before the mosque due to its strong smell, garlic was still used in cooking and treatment.',
    benefits: [
      'Fights infections',
      'Lowers inflammation',
      'Supports heart health',
      'Improves circulation'
    ],
    sources: ['The Prophetic Medicine by Ibn Qayyim']
  },
  {
    id: '16',
    title: 'Meat (Laḥm)',
    description: 'Eaten in moderation, meat was part of generous hospitality and festive meals during the Prophet\'s ﷺ time.',
    benefits: [
      'Builds strength',
      'Provides iron and energy',
      'Supports growth when consumed responsibly'
    ],
    sources: ['The Prophetic Medicine by Ibn Qayyim']
  },
  {
    id: '17',
    title: 'Barley Bread (Khubz al-Shaʿīr)',
    description: 'The Prophet ﷺ often ate coarse bread made from barley. Simple, sustaining, and natural.',
    benefits: [
      'Rich in fibre',
      'Stabilises energy',
      'Supports digestion',
      'Avoids blood sugar spikes'
    ],
    sources: ['The Prophetic Medicine by Ibn Qayyim']
  }
];

const SunnahFoodsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFoods, setFilteredFoods] = useState(sunnahFoods);
  
  useEffect(() => {
    document.title = 'Sunnah Foods - Baraka Bites';
    
    const filtered = sunnahFoods.filter(food => 
      food.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFoods(filtered);
  }, [searchTerm]);

  return (
    <div className="bg-cream py-16 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl mt-10 font-bold text-primary mb-4">
            <span className="text-gold">Sunnah</span> Foods Guide
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Explore authentic foods mentioned in classical Islamic texts, with insights from Ibn Qayyim's "The Prophetic Medicine". Learn about their traditional uses and benefits.
          </p>
        </div>
        
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Sunnah foods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFoods.length > 0 ? (
            filteredFoods.map(food => (
              <SunnahFoodItem
                key={food.id}
                title={food.title}
                description={food.description}
                benefits={food.benefits}
                sources={food.sources}
              />
            ))
          ) : (
            <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-xl font-bold text-primary mb-2">No results found</h3>
              <p className="text-gray-700">
                We couldn't find any Sunnah foods matching your search. Please try different keywords.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SunnahFoodsPage;