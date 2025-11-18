"use client"

import { Editor } from "@tiptap/react"
import { Table, Plus, Minus, Trash2, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface TableMenuProps {
  editor: Editor
}

export function TableMenu({ editor }: TableMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const isTableActive = editor.isActive("table")

  const insertTable = (rows: number, cols: number) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
    setIsOpen(false)
  }

  const addColumnBefore = () => {
    editor.chain().focus().addColumnBefore().run()
    setIsOpen(false)
  }

  const addColumnAfter = () => {
    editor.chain().focus().addColumnAfter().run()
    setIsOpen(false)
  }

  const deleteColumn = () => {
    editor.chain().focus().deleteColumn().run()
    setIsOpen(false)
  }

  const addRowBefore = () => {
    editor.chain().focus().addRowBefore().run()
    setIsOpen(false)
  }

  const addRowAfter = () => {
    editor.chain().focus().addRowAfter().run()
    setIsOpen(false)
  }

  const deleteRow = () => {
    editor.chain().focus().deleteRow().run()
    setIsOpen(false)
  }

  const deleteTable = () => {
    editor.chain().focus().deleteTable().run()
    setIsOpen(false)
  }

  const mergeCells = () => {
    editor.chain().focus().mergeCells().run()
    setIsOpen(false)
  }

  const splitCell = () => {
    editor.chain().focus().splitCell().run()
    setIsOpen(false)
  }

  const toggleHeaderRow = () => {
    editor.chain().focus().toggleHeaderRow().run()
    setIsOpen(false)
  }

  const toggleHeaderColumn = () => {
    editor.chain().focus().toggleHeaderColumn().run()
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded transition-colors ${
          isTableActive
            ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
        }`}
        title="表格操作"
      >
        <Table className="h-3.5 w-3.5" />
        <span>表格</span>
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 min-w-[200px] py-1">
          {!isTableActive ? (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                插入表格
              </div>
              <div className="grid grid-cols-3 gap-1 p-2">
                {[2, 3, 4, 5].map((rows) =>
                  [2, 3, 4, 5].map((cols) => (
                    <button
                      key={`${rows}x${cols}`}
                      onClick={() => insertTable(rows, cols)}
                      className="p-2 border border-slate-200 dark:border-slate-700 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-xs text-center transition-colors"
                      title={`${rows}行 x ${cols}列`}
                    >
                      {rows}×{cols}
                    </button>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                列操作
              </div>
              <button
                onClick={addColumnBefore}
                className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>在左侧插入列</span>
              </button>
              <button
                onClick={addColumnAfter}
                className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>在右侧插入列</span>
              </button>
              <button
                onClick={deleteColumn}
                className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
              >
                <Minus className="h-4 w-4" />
                <span>删除列</span>
              </button>

              <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>

              <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                行操作
              </div>
              <button
                onClick={addRowBefore}
                className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>在上方插入行</span>
              </button>
              <button
                onClick={addRowAfter}
                className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>在下方插入行</span>
              </button>
              <button
                onClick={deleteRow}
                className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
              >
                <Minus className="h-4 w-4" />
                <span>删除行</span>
              </button>

              <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>

              <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                单元格操作
              </div>
              <button
                onClick={mergeCells}
                className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
              >
                <span>合并单元格</span>
              </button>
              <button
                onClick={splitCell}
                className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
              >
                <span>拆分单元格</span>
              </button>
              <button
                onClick={toggleHeaderRow}
                className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
              >
                <span>切换表头行</span>
              </button>
              <button
                onClick={toggleHeaderColumn}
                className="w-full px-3 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
              >
                <span>切换表头列</span>
              </button>

              <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>

              <button
                onClick={deleteTable}
                className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>删除表格</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

