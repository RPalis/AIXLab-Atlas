import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { X, Network as NetworkIcon, Search, Maximize2, Minimize2, ExternalLink } from 'lucide-react';

interface ArchitectureNode {
  id: number;
  label: string;
  // 'root' = app shell, 'shell' = a persistent layout region (nav/header),
  // 'workspace' = a routed page/view, 'component' = any reusable component instance.
  group: 'root' | 'shell' | 'workspace' | 'component';
  storybookId?: string; // e.g. 'organisms-submissionstable--default' — drives the deep link
  componentType?: string; // shared base type, e.g. 'Button' — used to highlight all instances
}

interface ArchitectureMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: ArchitectureNode[];
  edges: { from: number; to: number }[];
  storybookBasePath?: string; // default '/storybook/index.html'
}

export const ArchitectureMapModalComponent: React.FC<ArchitectureMapModalProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
  storybookBasePath = '/storybook/index.html',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selected, setSelected] = useState<ArchitectureNode | null>(null);

  const storybookHref = (storybookId?: string) =>
    storybookId ? `${storybookBasePath}?path=/docs/${storybookId}` : undefined;

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const dataNodes = new DataSet(nodes);
    const dataEdges = new DataSet(edges);
    const options = {
      groups: {
        root: { color: { background: '#00828A', border: '#005F64' }, font: { color: '#ffffff', bold: true } },
        shell: { color: { background: '#334155', border: '#1E293B' }, font: { color: '#ffffff' } },
        workspace: { color: { background: '#002D62', border: '#001A38' }, font: { color: '#ffffff' } },
        component: { color: { background: '#3B82F6', border: '#1D4ED8' }, font: { color: '#ffffff' } },
      },
      physics: { stabilization: true, barnesHut: { gravitationalConstant: -3000, springLength: 95 } },
      interaction: { hover: true, tooltipDelay: 200 },
    };

    const network = new Network(containerRef.current, { nodes: dataNodes, edges: dataEdges }, options);
    networkRef.current = network;

    // Click a node: highlight every other instance sharing the same componentType, dim the rest.
    network.on('selectNode', (params) => {
      const node = nodes.find((n) => n.id === params.nodes[0]);
      setSelected(node ?? null);
      if (!node?.componentType) {
        dataNodes.update(nodes.map((n) => ({ id: n.id, opacity: 1 })));
        return;
      }
      dataNodes.update(
        nodes.map((n) => ({
          id: n.id,
          opacity: n.componentType === node.componentType ? 1 : 0.25,
        }))
      );
    });
    network.on('deselectNode', () => {
      setSelected(null);
      dataNodes.update(nodes.map((n) => ({ id: n.id, opacity: 1 })));
    });

    return () => network.destroy();
  }, [isOpen, nodes, edges]);

  // Search: focus + highlight matching nodes, dim the rest.
  useEffect(() => {
    if (!networkRef.current) return;
    if (!searchQuery.trim()) {
      networkRef.current.setData({ nodes: new DataSet(nodes), edges: new DataSet(edges) });
      return;
    }
    const q = searchQuery.toLowerCase();
    const matchIds = nodes.filter((n) => n.label.toLowerCase().includes(q)).map((n) => n.id);
    if (matchIds.length) networkRef.current.selectNodes(matchIds);
  }, [searchQuery, nodes, edges]);

  const groupedNodes = useMemo(() => nodes, [nodes]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
      <div
        className={`bg-surface border border-surface-border shadow-2xl flex flex-col overflow-hidden transition-all ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-5xl h-[80vh] rounded-2xl'
        }`}
      >
        <div className="p-4 border-b border-surface-border flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-primary shrink-0">
            <NetworkIcon className="w-5 h-5 text-indigo-500" />
            <span>Architecture Map</span>
          </div>
          <div className="flex-1 flex items-center gap-2 max-w-xs">
            <Search className="w-4 h-4 text-muted shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search components…"
              className="w-full bg-transparent text-sm text-primary placeholder:text-muted focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setIsFullscreen((v) => !v)}
              className="p-1.5 rounded-lg hover:bg-surface-hover text-secondary hover:text-primary"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-hover text-secondary hover:text-primary" aria-label="Close">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div ref={containerRef} className="flex-1 h-full bg-page" />
          {selected && (
            <div className="w-64 border-l border-surface-border p-4 overflow-y-auto shrink-0">
              <div className="text-sm font-semibold text-primary">{selected.label}</div>
              <div className="text-xs text-muted mt-1">{selected.group}</div>
              {selected.storybookId && (
                <a
                  href={storybookHref(selected.storybookId)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-xs text-brand hover:underline"
                >
                  View in Storybook <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
