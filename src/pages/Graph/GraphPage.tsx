import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import axios from 'axios';

const GraphPage: React.FC = () => {
  const cyRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [cy, setCy] = useState<cytoscape.Core | null>(null);

  useEffect(() => {
    const loadRelations = async () => {
      try {
        const res = await axios.get('https://liudu-backend.onrender.com/api/relations');
        const relations = res.data.relations;
        if (cyRef.current && relations.length > 0) {
          // 构建节点和边
          const nodes = relations.map((relation: any) => ({
            data: { 
              id: relation._id, 
              label: relation.person,
              relationType: relation.relationType,
              level: relation.level
            }
          }));
          const edges = relations
            .filter((relation: any) => relation.parent)
            .map((relation: any) => ({
              data: { 
                source: relation.parent, 
                target: relation._id,
                label: relation.relationType
              }
            }));
          const newCy = cytoscape({
            container: cyRef.current,
            elements: [...nodes, ...edges],
            style: [
              { 
                selector: 'node', 
                style: { 
                  'label': 'data(label)', 
                  'background-color': '#0074D9', 
                  'color': '#fff', 
                  'text-valign': 'center', 
                  'text-halign': 'center',
                  'width': 60,
                  'height': 60,
                  'font-size': 12
                } 
              },
              { 
                selector: 'edge', 
                style: { 
                  'width': 2, 
                  'line-color': '#ccc',
                  'curve-style': 'bezier',
                  'target-arrow-color': '#ccc',
                  'target-arrow-shape': 'triangle'
                } 
              },
            ],
            layout: { 
              name: 'cose',
              animate: true,
              animationDuration: 1000,
              nodeDimensionsIncludeLabels: true
            },
          });
          setCy(newCy);
        } else if (relations.length === 0) {
          // 可选：提示无数据
        }
      } catch (err: any) {
        // 可选：错误处理
      } finally {
        setLoading(false);
      }
    };
    loadRelations();
    return () => {
      if (cy) {
        cy.destroy();
      }
    };
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        加载中...
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '80vh', background: '#fafafa', border: '1px solid #eee' }} ref={cyRef}></div>
  );
};

export default GraphPage; 