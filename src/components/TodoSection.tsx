import React, { useState } from 'react';
import { useSkater } from '@/context/SkaterContext';
import { TodoItem } from '@/types/skater';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ListTodo, Dumbbell, Brain, Circle } from 'lucide-react';
import { SkateIcon } from '@/components/icons/SkateIcon';

const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
  'on-ice': SkateIcon,
  'off-ice': Dumbbell,
  'mental': Brain,
  'general': Circle,
};

const categoryColors: Record<string, string> = {
  'on-ice': 'text-on-ice',
  'off-ice': 'text-off-ice',
  'mental': 'text-mental',
  'general': 'text-primary',
};

const priorityColors: Record<string, string> = {
  low: 'bg-muted',
  medium: 'bg-gold/20',
  high: 'bg-destructive/20',
};

export const TodoSection: React.FC = () => {
  const { todos, addTodo, toggleTodo, deleteTodo } = useSkater();
  const [newTodo, setNewTodo] = useState('');
  const [category, setCategory] = useState<TodoItem['category']>('general');
  const [priority, setPriority] = useState<TodoItem['priority']>('medium');

  const handleAdd = () => {
    if (!newTodo.trim()) return;

    const todo: TodoItem = {
      id: crypto.randomUUID(),
      title: newTodo.trim(),
      category,
      priority,
      completed: false,
    };

    addTodo(todo);
    setNewTodo('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  const pendingTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Daily To-Do</h2>
        <p className="text-muted-foreground">Keep track of your daily training tasks</p>
      </div>

      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <div className="flex gap-2">
              <Select value={category} onValueChange={(v) => setCategory(v as any)}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on-ice">On-Ice</SelectItem>
                  <SelectItem value="off-ice">Off-Ice</SelectItem>
                  <SelectItem value="mental">Mental</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priority} onValueChange={(v) => setPriority(v as any)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAdd} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {todos.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <ListTodo className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-semibold mb-1">No tasks yet</h3>
            <p className="text-sm text-muted-foreground">Add tasks to organize your training day</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingTodos.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Pending ({pendingTodos.length})</h3>
              <div className="space-y-2">
                {pendingTodos.map((todo) => {
                  const IconComponent = categoryIcons[todo.category];
                  return (
                    <Card key={todo.id} className={`glass-card ${priorityColors[todo.priority]}`}>
                      <CardContent className="p-3 flex items-center gap-3">
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodo(todo.id)}
                          className="h-5 w-5"
                        />
                        <IconComponent className={`w-4 h-4 ${categoryColors[todo.category]}`} />
                        <span className="flex-1 font-medium">{todo.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${categoryColors[todo.category]} bg-background/50`}>
                          {todo.category}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteTodo(todo.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {completedTodos.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Completed ({completedTodos.length})</h3>
              <div className="space-y-2">
                {completedTodos.map((todo) => {
                  const IconComponent = categoryIcons[todo.category];
                  return (
                    <Card key={todo.id} className="glass-card opacity-60">
                      <CardContent className="p-3 flex items-center gap-3">
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodo(todo.id)}
                          className="h-5 w-5"
                        />
                        <IconComponent className={`w-4 h-4 ${categoryColors[todo.category]}`} />
                        <span className="flex-1 font-medium line-through text-muted-foreground">{todo.title}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteTodo(todo.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
