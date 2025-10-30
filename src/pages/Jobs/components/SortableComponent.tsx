import {motion} from 'framer-motion'
import type {SortableJobCardProps } from '@/types';
import type {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router-dom';
import { Archive, Edit3 } from 'lucide-react';

export function SortableJobCard({ job, isDark, gradientText, handleEditJob, handleArchive }:SortableJobCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`rounded-2xl shadow-lg p-4 sm:p-6 border transition-all cursor-grab active:cursor-grabbing ${
        isDark
          ? 'bg-gray-800/60 border-gray-700 hover:border-cyan-400/50'
          : 'bg-white/80 border-gray-200 hover:border-purple-400/50'
      } ${isDragging ? 'shadow-2xl' : ''}`}
    >
      <Link className={`text-lg sm:text-xl font-semibold mb-2 ${gradientText}`} to={`/jobs/${job.id}`}>
        {job.title}
      </Link>
      <p className="text-sm mb-1 text-gray-500">
        {job.department} • {job.location}
      </p>      
      <div className="flex flex-wrap gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            handleEditJob(job);
          }}
          className={`text-white px-3 py-2 rounded-lg flex items-center gap-1 sm:gap-2 text-sm font-medium flex-1 sm:flex-none justify-center ${
            isDark
              ? 'bg-linear-to-r from-cyan-400 to-blue-500'
              : 'bg-linear-to-r from-purple-600 to-pink-600'
          }`}
        >
          <Edit3 size={16} />
          <span>Edit</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            handleArchive(job.id);
          }}
          className="bg-gray-500/10 text-gray-600 dark:text-gray-400 px-3 py-2 rounded-lg flex items-center gap-1 sm:gap-2 text-sm font-medium flex-1 sm:flex-none justify-center"
        >
          <Archive size={16} />
          <span className="hidden sm:inline">Archive</span>
        </motion.button>
      </div>
    </div>
  );
}

