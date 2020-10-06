import { CircularProgress, makeStyles } from '@material-ui/core';
import {
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  PriorityHigh as PriorityHighIcon,
  Visibility as VisibilityIcon,
} from '@material-ui/icons';
import TreeItem from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import clsx from 'clsx';
import * as _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

import useInstrumentProposalBookings, {
  InstrumentProposalBooking,
} from 'hooks/proposalBooking/useInstrumentProposalBookings';

import ProposalBookingDialog from './ProposalBookingDialog';

type RenderTree = {
  id: string;
  name: string;
  children?: RenderTree[];
  onClick?: (event: React.MouseEvent<Element, MouseEvent>) => void;
};

const useStyles = makeStyles(theme => ({
  flexBox: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  autoOverflow: {
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
  instrument: string;
  refreshCalendar: () => void;
};

export default function ProposalBookingTree({
  instrument,
  refreshCalendar,
}: ProposalBookingTreeProps) {
  const classes = useStyles();
  const { loading, proposalBookings } = useInstrumentProposalBookings(
    instrument
  );
  const [
    selectedProposalBooking,
    setSelectedProposalBooking,
  ] = useState<InstrumentProposalBooking | null>(null);

  useEffect(() => {
    setSelectedProposalBooking(proposalBookings[0]);
  }, [loading, proposalBookings]);

  const groupedByCall: RenderTree[] = useMemo(() => {
    return _.chain(proposalBookings)
      .groupBy(({ call: { id } }) => id)
      .map((proposalBookings, id) => ({
        id: `call-${id}`, // avoid ID collision
        name: `Call: ${proposalBookings[0].call.shortCode}`,
        children: proposalBookings.map(proposalBooking => ({
          id: `proposal-${proposalBooking.proposal.id}`, // avoid ID collision
          name: `Proposal: ${proposalBooking.proposal.title}`,
          onClick: () => {
            setSelectedProposalBooking(proposalBooking);
          },
        })),
      }))
      .value();
  }, [proposalBookings]);

  const renderTree = (nodes: RenderTree) => {
    return (
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id}
        label={nodes.name}
        icon={nodes.onClick ? <VisibilityIcon /> : null}
        onIconClick={nodes.onClick}
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map(node => renderTree(node))
          : null}
      </TreeItem>
    );
  };

  const closeDialog = (shouldRefresh?: boolean) => {
    setSelectedProposalBooking(null);

    if (shouldRefresh) {
      refreshCalendar();
    }
  };

  if (loading) {
    return (
      <div className={clsx(classes.flexBox, classes.centered)}>
        <CircularProgress />
      </div>
    );
  }

  if (groupedByCall.length === 0) {
    return (
      <div className={clsx(classes.flexBox, classes.centered, classes.gray)}>
        <PriorityHighIcon className={classes.bottomSpacing} fontSize="large" />
        Instrument has no calls
      </div>
    );
  }

  return (
    <div className={clsx(classes.flexBox, classes.autoOverflow)}>
      {// unmount the component when the dialog is closed
      // so next time we start from scratch
      selectedProposalBooking !== null && (
        <ProposalBookingDialog
          proposalBooking={selectedProposalBooking}
          isDialogOpen={true}
          closeDialog={closeDialog}
        />
      )}

      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {groupedByCall.map(renderTree)}
      </TreeView>
    </div>
  );
}
