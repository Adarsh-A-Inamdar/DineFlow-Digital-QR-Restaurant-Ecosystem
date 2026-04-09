import { useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import { cn } from "../../lib/utils";

const CategoryBar = ({ activeCategory, setCategory }) => {
    const { data: categoriesData } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await api.get('/categories');
            return res.data;
        }
    });

    const displayCategories = ['All', ...(categoriesData || []).map(c => c.name)];

    return (
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {displayCategories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                        "whitespace-nowrap px-6 py-2 rounded-full font-medium transition-all duration-300",
                        activeCategory === cat 
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105" 
                            : "bg-white text-gray-600 border border-gray-100 hover:border-blue-200"
                    )}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default CategoryBar;
