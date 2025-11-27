import { useState, useCallback, useRef, useMemo } from 'react';
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
  
  const historyRef = useRef<HistoryState[]>([
    { nodes: initialNodes, edges: initialEdges }
  ]);
  const currentIndexRef = useRef(0);
  const isApplyingHistory = useRef(false);
  
  // Force re-render trigger for canUndo/canRedo
  const [, forceUpdate] = useState(0);

  const takeSnapshot = useCallback((nodes: Node[], edges: Edge[]) => {
    // Don't record if we're applying history
    if (isApplyingHistory.current) return;

    // Remove any future history if we're not at the end
    const newHistory = historyRef.current.slice(0, currentIndexRef.current + 1);
    
    // Add new state
    newHistory.push({ nodes, edges });
    
    // Limit history size
    if (newHistory.length > maxHistorySize) {
      newHistory.shift();
    } else {
      currentIndexRef.current = newHistory.length - 1;
    }
    
    historyRef.current = newHistory;
    forceUpdate(n => n + 1);
  }, [maxHistorySize]);

  const undo = useCallback(() => {
    if (currentIndexRef.current <= 0) return null;
    
    isApplyingHistory.current = true;
    currentIndexRef.current -= 1;
    
    const state = historyRef.current[currentIndexRef.current];
    forceUpdate(n => n + 1);
    
    // Reset flag after state updates propagate
    setTimeout(() => {
      isApplyingHistory.current = false;
    }, 100);
    
    return state;
  }, []);

  const redo = useCallback(() => {
    if (currentIndexRef.current >= historyRef.current.length - 1) return null;
    
    isApplyingHistory.current = true;
    currentIndexRef.current += 1;
    
    const state = historyRef.current[currentIndexRef.current];
    forceUpdate(n => n + 1);
    
    setTimeout(() => {
      isApplyingHistory.current = false;
    }, 100);
    
    return state;
  }, []);

  const clear = useCallback((nodes: Node[], edges: Edge[]) => {
    historyRef.current = [{ nodes, edges }];
    currentIndexRef.current = 0;
    isApplyingHistory.current = false;
    forceUpdate(n => n + 1);
  }, []);

  return useMemo(() => ({
    takeSnapshot,
    undo,
    redo,
    get canUndo() { return currentIndexRef.current > 0; },
    get canRedo() { return currentIndexRef.current < historyRef.current.length - 1; },
    clear,
  }), [takeSnapshot, undo, redo, clear]);
};
