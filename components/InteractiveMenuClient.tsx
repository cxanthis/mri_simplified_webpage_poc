"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import { useUser } from '@clerk/nextjs'

interface Article {
  chapter_id: string;
  slug: { current: string };
  title: string;
}

export interface TreeNode extends Article {
  children: TreeNode[];
}

interface InteractiveMenuProps {
  tree: TreeNode[];
  activeArticle?: Article;
  activeSlug?: string;
  completedSlugs: string[];
}

export default function InteractiveMenu({
  tree,
  activeArticle,
  activeSlug,
  completedSlugs,
}: InteractiveMenuProps) {
  const completedSet = useMemo(() => new Set(completedSlugs), [completedSlugs]);

  const { user } = useUser()
  const showStatus = Boolean(user)

  const initiallyExpanded = useMemo(() => {
    const expandedSet = new Set<string>();

    if (activeSlug === "mri-fundamentals" && tree.length > 0) {
      expandedSet.add(tree[0].chapter_id);
    } else if (activeSlug === "mri-procedures" && tree.length > 1) {
      expandedSet.add(tree[1].chapter_id);
    } else if (activeSlug === "mri-safety" && tree.length > 2) {
      expandedSet.add(tree[2].chapter_id);
    } else if (activeArticle) {
      const segments = activeArticle.chapter_id.split(".");
      for (let i = 0; i < segments.length - 1; i++) {
        expandedSet.add(segments.slice(0, i + 1).join("."));
      }
    }

    return expandedSet;
  }, [activeSlug, activeArticle, tree]);

  const getNodeStatus = (node: TreeNode): 'completed' | 'on-going' | 'not-started' | null => {
    if (!node.children || node.children.length === 0) return null

    const children = flattenTree(node)
    const doneCount = children.filter(n => completedSet.has(n.slug.current)).length

    if (doneCount === 0) return 'not-started'
    if (doneCount === children.length) return 'completed'
    return 'on-going'
  }

  const flattenTree = (node: TreeNode): TreeNode[] => {
    const stack = [...node.children]
    const result: TreeNode[] = []

    while (stack.length) {
      const n = stack.pop()!
      result.push(n)
      stack.push(...n.children)
    }

    return result
  }

  const [expanded, setExpanded] = useState<Set<string>>(initiallyExpanded);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getSubLabel = (node: TreeNode) => {
    const level = node.chapter_id.split(".").length;

    switch (level) {
      case 1: return `${node.children.length} chapters`;
      case 2: return `${node.children.length} sections`;
      case 3: return node.children.length > 0 ? `${node.children.length} sub-sections` : "";
      case 4: return node.children.length > 0 ? `${node.children.length} topics` : "";
      case 5: return "";
      default: return "";
    }
  };

  const renderNodes = (nodes: TreeNode[]) =>
    nodes.map((node) => {
      const level = node.chapter_id.split(".").length;
      const isActive = activeSlug === node.slug.current;
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expanded.has(node.chapter_id);
      const status = getNodeStatus(node)

      return (
        <React.Fragment key={node.chapter_id}>
          <li
            className={`flex items-center px-4 py-2 border-gray-200 border-b text-[1.3rem] ${
              isActive ? "bg-red-50" : ""
            }`}
            style={{ paddingLeft: `${level * 20}px` }}
          >
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(node.chapter_id);
                }}
                className="mr-2 text-gray-500 hover:text-gray-700"
              >
                {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
              </button>
            ) : (
              <span className="mr-2 w-4" />
            )}

            {level > 2 ? (
              <Link
                href={`/learn-mri/topic/${node.slug.current}`}
                className="hover:underline flex-1"
              >
                {node.title}
              </Link>
            ) : (
              <button
                onClick={() => {
                  if (hasChildren) toggleExpand(node.chapter_id);
                }}
                className="flex-1 text-left hover:underline"
              >
                {node.title}
              </button>
            )}

            <span className="ml-auto text-xs text-gray-500">
              {getSubLabel(node)}
            </span>

            {showStatus && (
              <>
                {status === 'completed' && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded bg-[#88b04b] text-white">Done</span>
                )}
                {status === 'on-going' && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded bg-[#f4a261] text-white">On-going</span>
                )}
                {status === 'not-started' && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded bg-[#c9c9c9] text-black">Not started</span>
                )}
                {!status && completedSet.has(node.slug.current) && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded bg-[#88b04b] text-white">Done</span>
                )}
              </>
            )}
            
          </li>

          {hasChildren && isExpanded && (
            <ul className="bg-white">{renderNodes(node.children)}</ul>
          )}
        </React.Fragment>
      );
    });

  return <>{renderNodes(tree)}</>;
}
