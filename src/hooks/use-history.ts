import { useState, useCallback, useRef } from 'react';
import { Node, Edge } from '@xyflow/react';

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

interface UseHistoryOptions {
  maxHistorySize?: number;
}

export const useHistory = (
  initialNodes: Node[],
  initialEdges: Edge[],
  options: UseHistoryOptions = {}
) => {
  const { maxHistorySize = 50 } = options;
  
  const [history, setHistory] = useState<HistoryState[]>([
    { nodes: initialNodes, edges: initialEdges }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isApplyingHistory = useRef(false);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const takeSnapshot = useCallback((nodes: Node[], edges: Edge[]) => {
    // Don't record if we're applying history
    if (isApplyingHistory.current) return;

    setHistory(prev => {
      // Remove any future history if we're not at the end
      const newHistory = prev.slice(0, currentIndex + 1);
      
      // Add new state
      newHistory.push({ nodes, edges });
      
      // Limit history size
      if (newHistory.length > maxHistorySize) {
        newHistory.shift();
        setCurrentIndex(prev => prev);
        return newHistory;
      }
      
      setCurrentIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [currentIndex, maxHistorySize]);

  const undo = useCallback(() => {
    if (!canUndo) return null;
    
    isApplyingHistory.current = true;
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    
    // Use setTimeout to ensure the flag is reset after state updates
    setTimeout(() => {
      isApplyingHistory.current = false;
    }, 0);
    
    return history[newIndex];
  }, [canUndo, currentIndex, history]);

  const redo = useCallback(() => {
    if (!canRedo) return null;
    
    isApplyingHistory.current = true;
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    
    setTimeout(() => {
      isApplyingHistory.current = false;
    }, 0);
    
    return history[newIndex];
  }, [canRedo, currentIndex, history]);

  const clear = useCallback((nodes: Node[], edges: Edge[]) => {
    setHistory([{ nodes, edges }]);
    setCurrentIndex(0);
    isApplyingHistory.current = false;
  }, []);

  return {
    takeSnapshot,
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
  };
};
