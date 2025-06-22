import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";

const suggestedTags = [
  "react",
  "redux",
  "nodejs",
  "mongodb",
  "javascript",
  "frontend",
  "backend",
];

const TagInput = ({ tags, setTags, error, setError }) => {
  const [input, setInput] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const addTag = (value) => {
    const tag = value.trim().replace(/^#*/, "").toLowerCase();
    if (!tag) return;
    if (tags.includes(tag)) {
      toast.warning("Tag already added");
      return;
    }

    setTags([...tags, tag]);
    setInput("");
    setError(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      // Auto-select top suggestion if available
      if (filteredSuggestions.length > 0) {
        addTag(filteredSuggestions[0]);
      } else {
        addTag(input);
      }
    }
  };

  const removeTag = (index) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  useEffect(() => {
    const filtered =
      input.length > 0
        ? suggestedTags.filter(
            (tag) =>
              tag.toLowerCase().includes(input.toLowerCase()) &&
              !tags.includes(tag)
          )
        : [];
    setFilteredSuggestions(filtered);
  }, [input, tags]);

  return (
    <div className="relative">
      <label className="pb-2 block text-sm font-medium text-gray-700">
        Tags <span className="text-red-500">*</span>
      </label>

      <div
        className={`flex flex-wrap gap-1 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-[3px] px-2 py-[6px] min-h-[35px] focus-within:ring-1 focus-within:ring-blue-500`}
      >
        {tags.map((tag, index) => (
          <motion.div
            key={tag}
            className="flex items-center bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-sm"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <span>#{tag}</span>
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-1 text-red-500 hover:text-red-700"
            >
              &times;
            </button>
          </motion.div>
        ))}

        <input
          type="text"
          className="flex-grow min-w-[120px] appearance-none outline-none px-1 py-[2px] sm:text-sm"
          placeholder="Type tag & press enter or comma"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Suggestions dropdown - only if input is typing */}
      <AnimatePresence>
        {input.length > 0 && filteredSuggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute mt-1 w-full bg-white border border-gray-300 rounded-[3px] shadow-md z-10 max-h-32 overflow-y-auto text-sm"
          >
            {filteredSuggestions.map((suggestion) => (
              <li
                key={suggestion}
                onClick={() => addTag(suggestion)}
                className="px-3 py-1 cursor-pointer hover:bg-blue-100"
              >
                #{suggestion}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {error && tags.length === 0 && (
        <p className="text-red-500 text-sm mt-1">
          At least one tag is required.
        </p>
      )}
    </div>
  );
};

export default TagInput;
