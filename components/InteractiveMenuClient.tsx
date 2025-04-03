"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
// Example icons from react-icons
import { FaCheckCircle, FaRegCircle, FaChevronRight, FaChevronDown } from "react-icons/fa";

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
}

export default function InteractiveMenu({
  tree,
  activeArticle,
  activeSlug,
}: InteractiveMenuProps) {
  // Decide which nodes start expanded (the path to the active article).
  const initiallyExpanded = useMemo(() => {
    const expandedSet = new Set<string>();
  
    // Give precedence to specific slugs.
    if (activeSlug === "mri-fundamentals") {
      if (tree.length > 0) {
        expandedSet.add(tree[0].chapter_id);
      }
    } else if (activeSlug === "mri-procedures") {
      if (tree.length > 1) {
        expandedSet.add(tree[1].chapter_id);
      }
    } else if (activeSlug === "mri-safety") {
      if (tree.length > 2) {
        expandedSet.add(tree[2].chapter_id);
      }
    } else if (activeArticle) {
      // For any other slug, expand the active article's ancestors.
      const segments = activeArticle.chapter_id.split(".");
      for (let i = 0; i < segments.length - 1; i++) {
        expandedSet.add(segments.slice(0, i + 1).join("."));
      }
    }
    return expandedSet;
  }, [activeSlug, activeArticle, tree]);      

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

  // For demonstration, we'll assume anything at level > 1 might be "completed"
  // or "in progress." In real usage, you'd fetch a "status" or "completed" field
  // from your data, or track user progress some other way.
  const isCompleted = (node: TreeNode) => {
    // Example: Mark sections deeper than top-level as completed
    // Or you can return a boolean from your actual data.
    return node.chapter_id.split(".").length > 1;
  };

  // Example "time" or "modules" text. Adjust logic as needed.
    const getSubLabel = (node: TreeNode) => {
        // Level 1 => part
        // Level 2 => chapter
        // Level 3 => section
        // Level 4 => sub-section
        // Level 5 => topic
        const level = node.chapter_id.split(".").length;
    
        switch (level) {
        case 1:
            // Part => count chapters
            return `${node.children.length} chapters`;
    
        case 2:
            // Chapter => count sections
            return `${node.children.length} sections`;
    
        case 3:
            // Section => count sub-sections
            if (node.children.length > 0) {
                return `${node.children.length} sub-sections`;
            } else {
                return "";
            }
    
        case 4:
            // Sub-section
            if (node.children.length > 0) {
            // If it has children, count topics
            return `${node.children.length} topics`;
            } else {
            // If no children, return "11 min"
            return ""; // or "11 min" or whatever you want
            }
    
        case 5:
            // Topic (or deeper) => you can decide what to do here
            return ""; // or "11 min" or whatever you want
    
        default:
            // Fallback
            return ""; // or "11 min" or whatever you want
        }
    };
  

    const renderNodes = (nodes: TreeNode[]) =>
        nodes.map((node) => {
          const level = node.chapter_id.split(".").length;
          const isActive = activeSlug === node.slug.current;
          const hasChildren = node.children && node.children.length > 0;
          const isExpanded = expanded.has(node.chapter_id);
    
          return (
            <React.Fragment key={node.chapter_id}>
              {/* Each item row */}
              <li
                className={`flex items-center px-4 py-2 border-gray-200 border-b text-[1.3rem] ${
                  isActive ? "bg-red-50" : ""
                }`}
                style={{ paddingLeft: `${level * 20}px` }} // indentation
              >
                {/* Expand/Collapse Arrow */}
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
    
                {/* Title & Link (if deeper than level 2) */}
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
    
                {/* Sub-label (e.g. "4 modules", "11 min", etc.) */}
                <span className="ml-auto text-xs text-gray-500">
                  {getSubLabel(node)}
                </span>
              </li>
    
              {/* Render children if expanded */}
              {hasChildren && isExpanded && (
                <ul className="bg-white">{renderNodes(node.children)}</ul>
              )}
            </React.Fragment>
          );
        });

  return <>{renderNodes(tree)}</>;
}
