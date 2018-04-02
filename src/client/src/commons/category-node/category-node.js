import React from 'react';
import PropTypes from 'prop-types';
import styles from './category-node.css';

function classnames(...classes) {
  // Use Boolean constructor as a filter callback
  // Allows for loose type truthy/falsey checks
  // Boolean("") === false;
  // Boolean(false) === false;
  // Boolean(undefined) === false;
  // Boolean(null) === false;
  // Boolean(0) === false;
  // Boolean("classname") === true;
  return classes.filter(Boolean).join(' ');
}

function isDescendant(older, younger) {
  return (
    !!older.children &&
    typeof older.children !== 'function' &&
    older.children.some(
      child => child === younger || isDescendant(child, younger)
    )
  );
}

export default class CategoryNode extends React.Component {
  static propTypes = {
    node: PropTypes.shape({}).isRequired,
    title: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    subtitle: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    path: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ).isRequired,
    treeIndex: PropTypes.number.isRequired,
    isSearchMatch: PropTypes.bool,
    isSearchFocus: PropTypes.bool,
    canDrag: PropTypes.bool,
    scaffoldBlockPxWidth: PropTypes.number.isRequired,
    toggleChildrenVisibility: PropTypes.func,
    buttons: PropTypes.arrayOf(PropTypes.node),
    className: PropTypes.string,
    style: PropTypes.shape({}),
  
    // Drag and drop API functions
    // Drag source
    connectDragPreview: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    didDrop: PropTypes.bool.isRequired,
    draggedNode: PropTypes.shape({}),
    canDrop: PropTypes.bool,
    parentNode: PropTypes.shape({}), // Needed for dndManager
    treeId: PropTypes.string.isRequired,
    isOver: PropTypes.bool.isRequired
  };

  static defaultProps = {
    isSearchMatch: false,
    isSearchFocus: false,
    canDrag: false,
    toggleChildrenVisibility: null,
    buttons: [],
    className: '',
    style: {},
    draggedNode: null,
    canDrop: false,
    title: null,
    subtitle: null,
    parentNode: null
  };

  render() {
    const {
      scaffoldBlockPxWidth,
      toggleChildrenVisibility,
      connectDragPreview,
      connectDragSource,
      isDragging,
      canDrop,
      canDrag,
      node,
      title,
      subtitle,
      draggedNode,
      path,
      treeIndex,
      isSearchMatch,
      isSearchFocus,
      buttons,
      className,
      style,
      didDrop,
      treeId, // eslint-disable-line
      isOver, // eslint-disable-line
      parentNode, // eslint-disable-line
      ...otherProps
    } = this.props;
    const nodeTitle = title || node.title;
    const nodeSubtitle = subtitle || node.subtitle;

    let handle;
    if (canDrag) {
      if (typeof node.children === 'function' && node.expanded) {
        // Show a loading symbol on the handle when the children are expanded
        //  and yet still defined by a function (a callback to fetch the children)
        handle = (
          <div className={styles.loadingHandle}>
            <div className={styles.loadingCircle}>
              {[...new Array(12)].map((_, index) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className={styles.loadingCirclePoint}
                />
              ))}
            </div>
          </div>
        );
      } else {
        // Show the handle used to initiate a drag-and-drop
        handle = connectDragSource(<div className={styles.moveHandle} />, {
          dropEffect: 'copy',
        });
      }
    }

    const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);
    const isLandingPadActive = !didDrop && isDragging;

    return (
      <div style={{ height: '100%' }} {...otherProps}>
        {toggleChildrenVisibility &&
          node.children &&
          (node.children.length > 0 || typeof node.children === 'function') && (
            <div>
              <button
                type="button"
                aria-label={node.expanded ? 'Collapse' : 'Expand'}
                className={
                  node.expanded ? styles.collapseButton : styles.expandButton
                }
                style={{ left: -0.5 * scaffoldBlockPxWidth }}
                onClick={() =>
                  toggleChildrenVisibility({
                    node,
                    path,
                    treeIndex,
                  })
                }
              />

              {node.expanded &&
                !isDragging && (
                  <div
                    style={{ width: scaffoldBlockPxWidth }}
                    className={styles.lineChildren}
                  />
                )}
            </div>
          )}

        <div className={styles.rowWrapper}>
          {/* Set the row preview to be used during drag and drop */}
          {connectDragPreview(
            <div
              className={classnames(
                styles.row,
                isLandingPadActive && styles.rowLandingPad,
                isLandingPadActive && !canDrop && styles.rowCancelPad,
                isSearchMatch && styles.rowSearchMatch,
                isSearchFocus && styles.rowSearchFocus,
                className
              )}
              style={{
                opacity: isDraggedDescendant ? 0.5 : 1,
                ...style,
              }}
            >
              {handle}

              <div
                className={classnames(
                  styles.rowContents,
                  !canDrag && styles.rowContentsDragDisabled
                )}
              >
                <div className={styles.rowLabel}>
                  <span
                    className={classnames(
                      styles.rowTitle,
                      node.subtitle && styles.rowTitleWithSubtitle
                    )}
                  >
                    {typeof nodeTitle === 'function'
                      ? nodeTitle({
                        node,
                        path,
                        treeIndex,
                      })
                      : nodeTitle}
                  </span>

                  {nodeSubtitle && (
                    <span className={styles.rowSubtitle}>
                      {typeof nodeSubtitle === 'function'
                        ? nodeSubtitle({
                          node,
                          path,
                          treeIndex,
                        })
                        : nodeSubtitle}
                    </span>
                  )}
                </div>

                <div className={styles.rowToolbar}>
                  {buttons.map((btn, index) => (
                    <div
                      key={index} // eslint-disable-line react/no-array-index-key
                      className={styles.toolbarButton}
                    >
                      {btn}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}