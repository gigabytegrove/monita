import Archive from '@mui/icons-material/Archive';
import Delete from '@mui/icons-material/Delete';
import Unarchive from '@mui/icons-material/Unarchive';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React from 'react';
import TimeAgo from 'react-timeago';

import {IMessage} from '../types';
import {TimeAgoFormatter} from '../common/TimeAgoFormatter';
import MessageCollaboration from './MessageCollaboration';

interface Props {
    message: IMessage;
    mine: boolean;
    onRefresh: () => Promise<void>;
    onArchive?: VoidFunction;
    onRestore?: VoidFunction;
    onDelete?: VoidFunction;
}

const initial = (value: string) => value.trim().slice(0, 1).toUpperCase() || '?';

const ChatMessage = ({message, mine, onRefresh, onArchive, onRestore, onDelete}: Props) => {
    const sender = message.senderName || message.title || 'Member';
    const parts = message.message.split(/(@[A-Za-z0-9._-]+)/g);

    return (
        <Box
            className="chat-message"
            sx={{
                display: 'grid',
                gridTemplateColumns: '38px minmax(0,1fr) auto',
                columnGap: 1.25,
                px: {xs: 1.25, sm: 2},
                py: 1,
                borderLeft: 2,
                borderLeftColor: mine ? 'primary.main' : 'transparent',
                bgcolor: mine ? 'action.hover' : 'transparent',
                '&:hover': {bgcolor: 'action.hover'},
            }}>
            <Avatar
                sx={{
                    width: 34,
                    height: 34,
                    mt: 0.15,
                    borderRadius: 0.25,
                    bgcolor: mine ? 'primary.main' : 'background.paper',
                    color: mine ? 'primary.contrastText' : 'text.primary',
                    border: mine ? 0 : 1,
                    borderColor: 'divider',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                }}>
                {initial(sender)}
            </Avatar>

            <Box sx={{minWidth: 0}}>
                <Stack
                    direction="row"
                    spacing={0.8}
                    useFlexGap
                    sx={{alignItems: 'baseline', flexWrap: 'wrap', mb: 0.25}}>
                    <Typography variant="body2" sx={{fontWeight: 780}}>
                        {mine ? 'You' : sender}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" title={message.date}>
                        <TimeAgo date={message.date} formatter={TimeAgoFormatter.long} />
                    </Typography>
                    {message.collaboration?.mentioned && (
                        <Chip size="small" variant="outlined" label="Mentioned you" />
                    )}
                </Stack>

                {message.message && (
                    <Typography
                        component="div"
                        sx={{
                            whiteSpace: 'pre-wrap',
                            overflowWrap: 'anywhere',
                            fontSize: '0.94rem',
                            lineHeight: 1.55,
                        }}>
                        {parts.map((part, index) =>
                            /^@[A-Za-z0-9._-]+$/.test(part) ? (
                                <Box
                                    component="span"
                                    key={part + index}
                                    sx={{
                                        display: 'inline',
                                        fontWeight: 800,
                                        px: 0.2,
                                        color: 'primary.main',
                                        bgcolor: 'action.selected',
                                    }}>
                                    {part}
                                </Box>
                            ) : (
                                <React.Fragment key={index}>{part}</React.Fragment>
                            )
                        )}
                    </Typography>
                )}

                <Box
                    sx={{
                        mt: 0.45,
                        '& .MuiButton-root': {minHeight: 26, fontSize: '0.72rem'},
                        '& .MuiChip-root': {height: 22},
                    }}>
                    <MessageCollaboration message={message} onChanged={onRefresh} />
                </Box>
            </Box>

            <Stack direction="row" spacing={0.1} sx={{alignSelf: 'start'}}>
                {onRestore && (
                    <Tooltip title="Restore">
                        <IconButton size="small" onClick={onRestore}>
                            <Unarchive fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
                {onArchive && (
                    <Tooltip title="Archive for me">
                        <IconButton size="small" onClick={onArchive}>
                            <Archive fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
                {onDelete && (
                    <Tooltip title="Delete">
                        <IconButton size="small" onClick={onDelete}>
                            <Delete fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Stack>
        </Box>
    );
};

export default ChatMessage;
