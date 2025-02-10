import { useState, useEffect } from "react";

const FilterEvent = ({ events, setFilteredEvents }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    // Extract unique categories from events
    const uniqueCategories = [...new Set(events.map(event => event.category))];
    setCategories(uniqueCategories);
  }, [events]);

  const handleFilterChange = (category) => {
    setSelectedCategory(category);
    if (category === "") {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(event => event.category === category));
    }
  };

  return (
    <div className="mb-4">
      <select
        value={selectedCategory}
        onChange={(e) => handleFilterChange(e.target.value)}
        className="p-2 border border-gray-300 rounded-md w-full"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>{category}</option>
        ))}
      </select>
    </div>
  );
};

export default FilterEvent;
