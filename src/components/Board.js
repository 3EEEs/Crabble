import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Square from "./Square";
import CreateArray from "./CreateArray";

const Board = ({
  selectedCell = null,
  setSelectedCell = () => {},
  content = [],
  setContent = () => {},
  size = 9,
  start = false,
  isInWord = [],
}) => {
  const [valueArray, setValueArray] = useState([]);

  useEffect(() => {
    if (start && valueArray.length === 0) {
      const newArray = CreateArray(size, 1);
      setValueArray(newArray);
    }
  }, [start, size, valueArray.length]);

  const handleSelect = (value) => {
    const [rowIndex, colIndex] = findCellIndex(value);
    const adjacentCells = [
      [rowIndex - 1, colIndex], // Top cell
      [rowIndex + 1, colIndex], // Bottom cell
      [rowIndex, colIndex - 1], // Left cell
      [rowIndex, colIndex + 1], // Right cell
    ];

    const hasAdjacentContent = adjacentCells.some(([r, c]) => {
      if (r >= 0 && r < size && c >= 0 && c < size) {
        return !!content[r][c];
      }
      return false;
    });

    if (hasAdjacentContent) {
      setSelectedCell(value);
    }
  };

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
                isCenter={isCenter}
                isSelected={selectedCell === value}
                isInWord={isInWord}
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
    padding: 33,
    flex: 1,
  },
  row: {
    flexDirection: "row",
  },
});

export default Board;
