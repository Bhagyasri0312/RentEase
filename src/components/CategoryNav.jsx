import { Link, useLocation } from 'react-router-dom';
import { CATEGORIES } from '../utils/categoryConfig';

export const CategoryNav = () => {
  const location = useLocation();
  const currentCategory = location.pathname.split('/').pop();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm overflow-hidden">
      <div className="w-full h-auto">
        <div className="flex items-stretch justify-start gap-0 overflow-x-auto scrollbar-hide px-2 sm:px-3 md:px-4">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const isActive = currentCategory === category.id;

            return (
              <Link
                key={category.id}
                to={category.path}
                title={category.description}
                className={`
                  inline-flex items-center justify-center gap-1 px-2.5 sm:px-3 md:px-4 lg:px-5 py-3 
                  text-xs sm:text-sm md:text-base font-medium
                  transition-all duration-200 whitespace-nowrap border-b-2 flex-shrink-0
                  hover:no-underline
                  ${
                    isActive
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-xs sm:text-sm md:text-base">{category.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
