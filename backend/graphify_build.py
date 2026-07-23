import json
import multiprocessing
from graphify.build import build_graph
from graphify.cluster import cluster_graph
from graphify.export import export_html, export_json
from graphify.report import generate_report
from pathlib import Path

if __name__ == '__main__':
    multiprocessing.freeze_support()

    out_dir = Path('C:/Users/Mo/Music/LAWHUB_APP/backend/graphify-out')
    ast_data = json.loads((out_dir / 'graph_ast.json').read_text())

    # Merge AST + semantic (only AST for pure code corpus)
    all_nodes = ast_data['nodes']
    all_edges = ast_data['edges']

    print('Building graph from ' + str(len(all_nodes)) + ' nodes, ' + str(len(all_edges)) + ' edges...')
    G = build_graph(all_nodes, all_edges)

    print('Clustering communities...')
    G = cluster_graph(G)

    print('Exporting HTML visualization...')
    export_html(G, out_dir / 'graph.html')

    print('Exporting JSON...')
    export_json(G, out_dir / 'graph.json')

    print('Generating GRAPH_REPORT.md...')
    report = generate_report(G)
    (out_dir / 'GRAPH_REPORT.md').write_text(report)

    print('Done! Outputs in ' + str(out_dir))
    print('  graph.html   - interactive visualization')
    print('  graph.json   - persistent queryable graph')
    print('  GRAPH_REPORT.md - audit report')
