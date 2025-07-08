import React, { useEffect, useRef } from 'react';
import cytoscape from 'cytoscape';
import axios from 'axios';

const GraphPage: React.FC = () => {
  const cyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cy: cytoscape.Core | null = null;
    axios.get('/api/graph').then(res => {
      const { nodes, edges } = res.data;
      if (cyRef.current) {
        cy = cytoscape({
          container: cyRef.current,
          elements: [
            ...nodes.map((node: any) => ({ data: { id: node.id, label: node.label } })),
            ...edges.map((edge: any) => ({ data: { source: edge.source, target: edge.target } })),
          ],
          style: [
            { selector: 'node', style: { 'label': 'data(label)', 'background-color': '#0074D9', 'color': '#fff', 'text-valign': 'center', 'text-halign': 'center' } },
            { selector: 'edge', style: { 'width': 2, 'line-color': '#ccc' } },
          ],
          layout: { name: 'cose' },
        });
      }
    });
    return () => { if (cy) cy.destroy(); };
  }, []);

  return (
    <div style={{ width: '100%', height: '80vh', background: '#fafafa', border: '1px solid #eee' }} ref={cyRef}></div>
  );
};

export default GraphPage; 