DO
$$
BEGIN
	IF register_patch('RenameProposalIdToProposalPk.sql', 'jekabskarklins', 'Rename proposal id to proposal_pk', '2021-06-14') THEN
    ALTER TABLE proposal_bookings RENAME COLUMN proposal_id TO proposal_pk;
	END IF;
END;
$$
LANGUAGE plpgsql;
