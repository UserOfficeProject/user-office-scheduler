import {
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  PriorityHigh as PriorityHighIcon,
} from '@mui/icons-material';
import { TreeView, TreeItem } from '@mui/lab';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { chain } from 'lodash';
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { ProposalBookingStatusCore } from 'generated/sdk';
import { InstrumentProposalBooking } from 'hooks/proposalBooking/useInstrumentProposalBookings';

import ProposalBookingDialog from './ProposalBookingDialog';
import ProposalBookingTreeTitle from './ProposalBookingTreeTitle';

type RenderTree = {
  id: string;
  title: ReactNode;
  proposalBookingId?: number;
  completed?: boolean;
  instrumentId?: number;
  children?: RenderTree[];
  onClick?: React.MouseEventHandler;
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',

    '& [role="group"] [role="treeitem"] .MuiTreeItem-content .MuiTreeItem-iconContainer':
      {
        display: 'none',
      },
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  autoOverflowY: {
    overflowY: 'auto',
  },
  bottomSpacing: {
    marginBottom: theme.spacing(2),
  },
  gray: {
    color: theme.palette.grey[500],
  },
}));

type ProposalBookingTreeProps = {
  refreshCalendar: () => void;
  setDraggedEvent: Dispatch<
    SetStateAction<{ proposalBookingId: number; instrumentId: number } | null>
  >;
  proposalBookings: InstrumentProposalBooking[];
};

export default function ProposalBookingTree({
  refreshCalendar,
  proposalBookings,
  setDraggedEvent,
}: ProposalBookingTreeProps) {
  const classes = useStyles();

  const [selectedProposalBooking, setSelectedProposalBooking] =
    useState<InstrumentProposalBooking | null>(null);

  const groupedByCall: RenderTree[] = useMemo(
    () =>
      chain(proposalBookings)
        .groupBy(({ call }) => call?.id)
        .map((proposalBookings, id) => ({
          id: `call-${id}`, // avoid numerical ID collision
          title: `Call: ${proposalBookings[0].call?.shortCode}`,
          children: proposalBookings.map((proposalBooking) => ({
            id: `proposal-${proposalBooking.proposal?.primaryKey}`, // avoid numerical ID collision
            proposalBookingId: proposalBooking.id,
            completed:
              proposalBooking.status === ProposalBookingStatusCore.COMPLETED,
            instrumentId: proposalBooking.instrument?.id,
            title: (
              <ProposalBookingTreeTitle proposalBooking={proposalBooking} />
            ),
            onClick: () => setSelectedProposalBooking(proposalBooking),
          })),
        }))
        .value(),
    [proposalBookings]
  );

  const ref = useCallback((el: Element) => {
    el?.addEventListener('focusin', (e) => {
      // Disable Treeview focus system which make draggable on TreeItem unusable
      // see https://github.com/mui-org/material-ui/issues/29518
      e.stopImmediatePropagation();
    });
  }, []);

  const renderTree = (nodes: RenderTree) => {
    return (
      <TreeItem
        key={nodes.id}
        ref={ref}
        nodeId={nodes.id}
        label={nodes.title}
        onClick={nodes.onClick}
        draggable={!!nodes.proposalBookingId && !nodes.completed}
        onDragStart={() => {
          if (nodes.proposalBookingId && nodes.instrumentId) {
            setDraggedEvent({
              proposalBookingId: nodes.proposalBookingId,
              instrumentId: nodes.instrumentId,
            });
          }
        }}
        onDragEnd={() => {
          setDraggedEvent(null);
        }}
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node))
          : null}
      </TreeItem>
    );
  };

  const handleCloseDialog = (shouldRefresh?: boolean) => {
    setSelectedProposalBooking(null);

    if (shouldRefresh) {
      refreshCalendar();
    }
  };

  if (groupedByCall.length === 0) {
    return (
      <div className={clsx(classes.root, classes.centered, classes.gray)}>
        <PriorityHighIcon className={classes.bottomSpacing} fontSize="large" />
        Instrument has no calls
      </div>
    );
  }

  return (
    <div className={clsx(classes.root, classes.autoOverflowY)}>
      {
        // unmount the component when the dialog is closed
        // so next time we start from scratch
        selectedProposalBooking !== null && (
          <ProposalBookingDialog
            activeProposalBookingId={selectedProposalBooking.id}
            isDialogOpen={true}
            closeDialog={handleCloseDialog}
          />
        )
      }

      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        id="instrument-calls-tree-view"
      >
        {groupedByCall.map(renderTree)}
      </TreeView>
    </div>
  );
}
