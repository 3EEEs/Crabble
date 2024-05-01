import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Square from "./Square";
import CreateArray from "./CreateArray";

const Board = ({
  selectedCell,
  setSelectedCell,
  content,
  setContent,
  size,
  start,
}) => {
  const [valueArray, setValueArray] = useState([]);

  useEffect(() => {
    if (start && valueArray.length === 0) {
      const newArray = CreateArray(size, 1);
      setValueArray(newArray);
    }
  }, [start, size, valueArray.length]);

  const findCellIndex = (value) => {
    for (let i = 0; i < valueArray.length; i++) {
      const row = valueArray[i];
      const colIndex = row.indexOf(value);
      if (colIndex !== -1) {
        return [i, colIndex];
      }
    }
    return [-1, -1]; // If value is not found
  };

  const handleSelect = (value) => {
    // If adjacent cells have some content, allow placement
    const [rowIndex, colIndex] = findCellIndex(value);
    const adjacentCells = [
      [rowIndex - 1, colIndex], // Top cell
      [rowIndex + 1, colIndex], // Bottom cell
      [rowIndex, colIndex - 1], // Left cell
      [rowIndex, colIndex + 1], // Right cell
    ];

    // Check if any adjacent cell has content
    const hasAdjacentContent = adjacentCells.some(([r, c]) => {
      if (r >= 0 && r < size && c >= 0 && c < size) {
        return !!content[r][c]; // Check if content exists
      }
      return false;
    });

    if (hasAdjacentContent) {
      setSelectedCell(value);
    }
  };

  return (
    <View style={styles.container}>
      {valueArray.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((value, colIndex) => {
            const isCenter =
              rowIndex === Math.floor(size / 2) &&
              colIndex === Math.floor(size / 2);
            return (
              <Square
                key={colIndex}
                value={value}
                isCenter={isCenter} // Define the center cell
                isSelected={selectedCell === value} // Check if the square is selected
                onSelect={handleSelect}
                content={content[rowIndex][colIndex]}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    flex: 1,
  },
  row: {
    flexDirection: "row",
  },
});

export default Board;
