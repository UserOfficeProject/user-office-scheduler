import { makeStyles } from '@material-ui/core';
import {
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  PriorityHigh as PriorityHighIcon,
  Visibility as VisibilityIcon,
} from '@material-ui/icons';
import { TreeView, TreeItem } from '@material-ui/lab';
import clsx from 'clsx';
import * as _ from 'lodash';
import React, { ReactNode, useMemo, useState } from 'react';

import { InstrumentProposalBooking } from 'hooks/proposalBooking/useInstrumentProposalBookings';

import ProposalBookingDialog from './ProposalBookingDialog';
import ProposalBookingTreeTitle from './ProposalBookingTreeTitle';

type RenderTree = {
  id: string;
  title: ReactNode;
  children?: RenderTree[];
  onClick?: React.MouseEventHandler;
};

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
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
  proposalBookings: InstrumentProposalBooking[];
};

export default function ProposalBookingTree({
  refreshCalendar,
  proposalBookings,
}: ProposalBookingTreeProps) {
  const classes = useStyles();

  const [
    selectedProposalBooking,
    setSelectedProposalBooking,
  ] = useState<InstrumentProposalBooking | null>(null);

  const groupedByCall: RenderTree[] = useMemo(
    () =>
      _.chain(proposalBookings)
        .groupBy(({ call: { id } }) => id)
        .map((proposalBookings, id) => ({
          id: `call-${id}`, // avoid numerical ID collision
          title: `Call: ${proposalBookings[0].call.shortCode}`,
          children: proposalBookings.map(proposalBooking => ({
            id: `proposal-${proposalBooking.proposal.id}`, // avoid numerical ID collision
            title: (
              <ProposalBookingTreeTitle proposalBooking={proposalBooking} />
            ),
            onClick: () => setSelectedProposalBooking(proposalBooking),
          })),
        }))
        .value(),
    [proposalBookings]
  );

  const renderTree = (nodes: RenderTree) => {
    return (
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id}
        label={nodes.title}
        icon={nodes.onClick ? <VisibilityIcon /> : null}
        onIconClick={nodes.onClick}
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map(node => renderTree(node))
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
      {// unmount the component when the dialog is closed
      // so next time we start from scratch
      selectedProposalBooking !== null && (
        <ProposalBookingDialog
          activeProposalBookingId={selectedProposalBooking.id}
          isDialogOpen={true}
          closeDialog={handleCloseDialog}
        />
      )}

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
