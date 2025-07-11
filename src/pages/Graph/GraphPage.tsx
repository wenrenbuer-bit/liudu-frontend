import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import axios from 'axios';
import { Button, Modal, Form, Input, Select, message, Spin, Empty } from 'antd';

const { Option } = Select;

const API_BASE = 'https://liudu-backend.onrender.com';

const relationTypes = [
  '同事', '朋友', '家人', '上级', '下属', '合作伙伴', '其他'
];

const GraphPage: React.FC = () => {
  const cyRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [relations, setRelations] = useState<any[]>([]);
  const [cy, setCy] = useState<cytoscape.Core | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState<'add' | 'edit'>('add');
  const [currentNode, setCurrentNode] = useState<any>(null);
  const [form] = Form.useForm();
  const [parentOptions, setParentOptions] = useState<any[]>([]);
  const [meNode, setMeNode] = useState<any>(null);

  // 加载数据
  const loadRelations = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/relations`);
      setRelations(res.data.relations);
      // 找到“我”节点
      const me = res.data.relations.find((r: any) => r.person === '我' && r.relationType === '本人');
      setMeNode(me);
    } catch (err) {
      message.error('加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 渲染cytoscape
  useEffect(() => {
    if (!cyRef.current) return;
    if (!relations) return;
    if (cy) cy.destroy();
    if (relations.length === 0) return;
    const nodes = relations.map((relation: any) => ({
      data: {
        id: relation._id,
        label: relation.person,
        relationType: relation.relationType,
        level: relation.level,
        isMe: relation.person === '我' && relation.relationType === '本人'
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
            'background-color': 'mapData(isMe, 1, #faad14, #0074D9)',
            'color': '#fff',
            'text-valign': 'center',
            'text-halign': 'center',
            'width': 'mapData(isMe, 1, 100, 60)',
            'height': 'mapData(isMe, 1, 100, 60)',
            'font-size': 'mapData(isMe, 1, 22, 12)',
            'border-width': 'mapData(isMe, 1, 6, 0)',
            'border-color': 'mapData(isMe, 1, #faad14, #0074D9)'
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
    // 右键节点弹出菜单
    newCy.on('cxttap', 'node', (evt) => {
      const node = evt.target;
      // “我”节点不可编辑/删除
      if (node.data('isMe')) return;
      setEditMode('edit');
      setCurrentNode(relations.find(r => r._id === node.id()));
      setModalVisible(true);
      form.setFieldsValue({
        person: node.data('label'),
        relationType: node.data('relationType'),
        level: node.data('level'),
        parent: relations.find(r => r._id === node.id())?.parent || undefined
      });
      setParentOptions(relations.filter(r => r._id !== node.id() && !(r.person === '我' && r.relationType === '本人')));
    });
    setCy(newCy);
    // eslint-disable-next-line
  }, [relations]);

  useEffect(() => {
    loadRelations();
    // eslint-disable-next-line
  }, []);

  // 打开添加
  const openAddModal = () => {
    setEditMode('add');
    setCurrentNode(null);
    setModalVisible(true);
    // 默认parent为“我”
    form.setFieldsValue({ person: '', relationType: '', level: '', parent: meNode?._id });
    setParentOptions(relations.filter(r => !(r.person === '我' && r.relationType === '本人')));
  };

  // 提交表单
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // 修复parent为undefined时不传递
      if (!values.parent) delete values.parent;
      if (editMode === 'add') {
        await axios.post(`${API_BASE}/api/relations`, values);
        message.success('添加成功');
      } else if (editMode === 'edit' && currentNode) {
        await axios.put(`${API_BASE}/api/relations/${currentNode._id}`, values);
        message.success('修改成功');
      }
      setModalVisible(false);
      loadRelations();
    } catch (err) {
      // 校验失败或请求失败
    }
  };

  // 删除节点
  const handleDelete = async () => {
    if (!currentNode) return;
    Modal.confirm({
      title: '确认删除该节点及其所有子节点？',
      onOk: async () => {
        await axios.delete(`${API_BASE}/api/relations/${currentNode._id}`);
        message.success('删除成功');
        setModalVisible(false);
        loadRelations();
      }
    });
  };

  return (
    <div style={{ width: '100%', height: '100vh', background: '#fafafa' }}>
      <div style={{ padding: 16, borderBottom: '1px solid #eee', background: '#fff' }}>
        <Button type="primary" onClick={openAddModal}>添加关系</Button>
      </div>
      {loading ? (
        <Spin style={{ marginTop: 100 }} />
      ) : relations.length === 0 ? (
        <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Empty description="暂无数据，请添加关系" />
          <Button type="primary" style={{ marginTop: 16 }} onClick={openAddModal}>添加关系</Button>
        </div>
      ) : (
        <div style={{ width: '100%', height: '80vh' }} ref={cyRef}></div>
      )}
      <Modal
        title={editMode === 'add' ? '添加关系' : '编辑关系'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        footer={[
          editMode === 'edit' && <Button key="delete" danger onClick={handleDelete}>删除</Button>,
          <Button key="cancel" onClick={() => setModalVisible(false)}>取消</Button>,
          <Button key="ok" type="primary" onClick={handleOk}>确定</Button>
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="person" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}> <Input autoComplete="off" /> </Form.Item>
          <Form.Item name="relationType" label="关系类型" rules={[{ required: true, message: '请选择类型' }]}> <Select>{relationTypes.map(t => <Option key={t} value={t}>{t}</Option>)}</Select> </Form.Item>
          <Form.Item name="level" label="层级"> <Input placeholder="可选" autoComplete="off" /> </Form.Item>
          <Form.Item name="parent" label="上级节点"> <Select allowClear placeholder="无（顶级）">{parentOptions.map(opt => <Option key={opt._id} value={opt._id}>{opt.person}</Option>)}</Select> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GraphPage; 