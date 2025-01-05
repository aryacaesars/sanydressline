import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const FilterPanel = ({ onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isVisible, setIsVisible] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/category");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleFilterChange = () => {
    onFilterChange({ category: selectedCategory, isVisible });
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-semibold mb-4">Filter Products</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Category</label>
        <Select onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.CategoryID} value={String(category.CategoryID)}>
                {category.Name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Visibility</label>
        <Select onValueChange={setIsVisible}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="true">Visible</SelectItem>
            <SelectItem value="false">Hidden</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleFilterChange}>Apply Filters</Button>
    </div>
  );
};

export default FilterPanel;