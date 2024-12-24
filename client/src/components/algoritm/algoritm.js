import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TodoApi } from '../../api';

class Edge {
    constructor(u, v, capacity) {
        this.u = u;
        this.v = v;
        this.capacity = capacity;
        this.flow = 0; 
    }
}

class Graph {
    constructor(V) {
        this.V = V; 
        this.edges = []; 
        this.adj = Array.from({ length: V }, () => []); 
    }

    addEdge(u, v, capacity) {
        const edge = new Edge(u, v, capacity);
        const reverseEdge = new Edge(v, u, 0); 

        edge.reverse = reverseEdge;
        reverseEdge.reverse = edge;

        this.adj[u].push(edge);
        this.adj[v].push(reverseEdge);

        this.edges.push(edge);
    }

    bfs(s, t, parent) {
        const visited = Array(this.V).fill(false);
        const queue = [];

        queue.push(s);
        visited[s] = true;
        parent[s] = -1;

        while (queue.length > 0) {
            const u = queue.shift();

            for (const edge of this.adj[u]) {
                const v = edge.v;
                if (!visited[v] && edge.capacity - edge.flow > 0) {
                    queue.push(v);
                    parent[v] = u;
                    visited[v] = true;
                    if (v === t) return true; 
                }
            }
        }

        return false; 
    }

    getMaxFlow(s, t) {
        let maxFlow = 0;
        const parent = Array(this.V).fill(-1);

        while (this.bfs(s, t, parent)) {
            let pathFlow = Infinity;

            for (let v = t; v !== s; v = parent[v]) {
                const u = parent[v];
                const edge = this.adj[u].find(e => e.v === v);
                pathFlow = Math.min(pathFlow, edge.capacity - edge.flow);
            }

            for (let v = t; v !== s; v = parent[v]) {
                const u = parent[v];
                const edge = this.adj[u].find(e => e.v === v);
                edge.flow += pathFlow;
                edge.reverse.flow -= pathFlow;
            }

            maxFlow += pathFlow;
        }

        return maxFlow;
    }
}

export default function Algoritm() {
    const [todos, setTodos] = useState([]);
    const [lastVershin, setLastVershin] = useState([]);
    const [lastCount, setLastCount] = useState(0);
    const [lastIstok, setLastIstok] = useState(0);
    const [lastStok, setLastStok] = useState(0);
    const [maxFlow, setMaxFlow] = useState(null);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const fetchedTodos = await TodoApi.getTodos();
            setTodos(fetchedTodos);
        } catch (error) {
            console.error('Ошибка при получении задач:', error);
        }
    };

    useEffect(() => {
        if (todos.length > 0) {
            const lastTodo = todos[todos.length - 1];
            const strArray = lastTodo.vershin.slice(1, -1).split('","');
            const numberArray = strArray.map(row => row.split(',').map(item => Number(item.replace(/^["\s]+|["\s]+$/g, ''))));

            setLastCount(Number(lastTodo.count));
            setLastVershin(numberArray);
            setLastStok(Number(lastTodo.stok));
            setLastIstok(Number(lastTodo.istok));
        }
    }, [todos]);

    useEffect(() => {
        if (lastCount > 0) {
            const g = new Graph(lastCount);
            for (let index = 0; index < lastVershin.length; index++) {
                g.addEdge(lastVershin[index][0] - 1, lastVershin[index][1] - 1, lastVershin[index][2]);
            }
            const flow = g.getMaxFlow(lastIstok - 1, lastStok - 1);
            setMaxFlow(flow);
        }
    }, [lastCount, lastVershin, lastIstok, lastStok]);

    return (
        <div>
            <h2>Максимальный поток:</h2>
            <h3 style={{ color: 'red', marginBottom: '60px' }}>{maxFlow}</h3>
        </div>
    );
}