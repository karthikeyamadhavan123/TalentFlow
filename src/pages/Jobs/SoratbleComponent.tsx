import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'

import type { DragEndEvent } from '@dnd-kit/core'
import {
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable'
import { SortableJobCard } from './SortableJobCard'
import type {JobsGridProps } from '@/types'



export function JobsGrid({
    jobs,
    isDark,
    gradientText,
    handleEditJob,
    handleArchive,
    selectedJob,
    onReorder
}: JobsGridProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        if (!over || active.id === over.id || selectedJob) return

        const oldIndex = jobs.findIndex((job) => job.id === active.id)
        const newIndex = jobs.findIndex((job) => job.id === over.id)

        if (oldIndex !== -1 && newIndex !== -1) {
            await onReorder(active.id as string, oldIndex, newIndex)
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={jobs.map(job => job.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {jobs.map((job) => (
                        <SortableJobCard
                            key={job.id}
                            job={job}
                            isDark={isDark}
                            gradientText={gradientText}
                            handleEditJob={handleEditJob}
                            handleArchive={handleArchive}
                            selectedJob={selectedJob}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    )
}