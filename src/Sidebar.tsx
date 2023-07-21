import React, { useState } from 'react';
import { TextField, List, ListItem, ListItemText, Tooltip, Box, Typography, LinearProgress } from '@mui/material';
import Textarea from './Textarea';

const SideBar: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState<string | null>('input');
    const [keyword, setKeyword] = useState<string>('');
    const [pageTitle, setPageTitle] = useState<string>('');
    const [metaDescription, setMetaDescription] = useState<string>('');
    const [titleHelperVisibility, setTitleHelperVisibility] = useState<boolean>(false);
    const [descriptionHelperVisibility, setDescriptionHelperVisibility] = useState<boolean>(false);

    const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(event.target.value);
    };

    const handlePageTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPageTitle(event.target.value);
    };

    const handleMetaDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMetaDescription(event.target.value);
    };

    const handleTitleBlur = () => {
        setTitleHelperVisibility(false);
    };

    const handleDescriptionBlur = () => {
        setDescriptionHelperVisibility(false);
    };

    const helper = {
        keywordNotEmpty: keyword !== "",
        keywordInTitle: keyword !== "" && pageTitle.toLowerCase().includes(keyword.toLowerCase()),
        keywordAtBeginning: keyword !== "" && pageTitle.toLowerCase().startsWith(keyword.toLowerCase()),
        titleSufficient: pageTitle.length >= 30,
        titleGreat: pageTitle.length >= 50,
        titleTooLong: pageTitle.length > 60,
        descriptionLength: metaDescription.length >= 50,
        descriptionTooLong: metaDescription.length > 160,
        keywordInDescription: keyword !== "" && metaDescription.toLowerCase().includes(keyword.toLowerCase())
    };

    const renderHelper = (check: boolean, label: string, colorFn: () => string) => {
        return (
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
            <Box
            sx={{
                minWidth: 16,
                minHeight: 16,
                width: 16,
                height: 16,
                marginRight: '0.5rem',
                backgroundColor: colorFn(),
                borderRadius: '50%',
            }}
            />
            <Typography variant="body2">{label}</Typography>
        </Box>
        );
    };

    const formatTitle = (title: string) => {
        const maxLength = 60;
        let trimmedTitle = title;

        if (trimmedTitle.length > maxLength) {
        while (trimmedTitle.length > maxLength) {
            let words = trimmedTitle.split(' ');
            words.pop();
            trimmedTitle = words.join(' ');
        }
        trimmedTitle = trimmedTitle + '...';
        }

        return trimmedTitle;
    }

    const formatDescription = (description: string) => {
        const maxLength = 158;
        let trimmedDescription = description;

        if (trimmedDescription.length > maxLength) {
        while (trimmedDescription.length > maxLength) {
            let words = trimmedDescription.split(' ');
            words.pop();
            trimmedDescription = words.join(' ');
        }
        trimmedDescription = trimmedDescription + '...';
        }

        return trimmedDescription;
    }

    const calculateTitleScore = () => {
        let score = 0;
        if(helper.keywordInTitle) score += 25;
        if(helper.keywordAtBeginning) score += 25;
        if(helper.titleSufficient) {
            if(helper.titleGreat) score += 50;
            else score += 25;
        }
        return score;
    };

    const renderContent = () => {
        if (activeMenu === 'input') {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ marginTop: '2rem' }}>
                <TextField
                label="1. Enter focus keyword"
                variant="outlined"
                value={keyword}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ style: { paddingLeft: '15px' } }}
                onChange={handleKeywordChange}
                />
                <Box
                sx={{
                    width: '100%',
                    borderBottom: '1px dashed #aaa',
                    paddingTop: '10px',
                    marginTop: '15px',
                    marginBottom: '15px',
                }}
                />
            </Box>

            <Box sx={{ display: 'flex' }}>
                <Tooltip placement="top" title="Google Search result preview">
                <img
                    height="50"
                    width="50"
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/800px-Google_%22G%22_Logo.svg.png"
                    alt="Google logo"
                    style={{ marginRight: '1rem' }}
                />
                </Tooltip>
                <h3>Google Preview</h3>
            </Box>

            <Box
                sx={{
                backgroundColor: '#f8f8f8',
                padding: '1rem',
                marginTop: '1rem',
                borderRadius: '8px',
                textAlign: 'left',
                }}
            >
                <Typography variant="body2" component="div" color="text.secondary" gutterBottom sx={{ fontSize: '13px' }}>
                {'example.com > sample-url'}
                </Typography>
                <Typography variant="h6" component="div" gutterBottom sx={{ color: '#1967D2', wordWrap: 'break-word' }}>
                {pageTitle ? formatTitle(pageTitle) : 'This is an Example page Title'}
                </Typography>
                <Typography variant="body2" component="div" color="text.secondary" sx={{ fontSize: '14px', wordWrap: 'break-word' }}>
                {metaDescription ? formatDescription(metaDescription) : 'Use the input fields to write a custom page Title and Meta description. This preview box shows you how your page will look in the search results from Google.'}
                </Typography>
            </Box>

            <Box sx={{ marginTop: '2rem' }}>
                <Box
                sx={{
                    width: '100%',
                    marginBottom: '1rem',
                }}
                >
                <TextField
                    label="2. Enter Page Title"
                    variant="outlined"
                    value={pageTitle}
                    InputLabelProps={{
                    shrink: true,
                    }}
                    fullWidth
                    onFocus={() => setTitleHelperVisibility(true)}
                    onBlur={handleTitleBlur}
                    onChange={handlePageTitleChange}
                />

                {titleHelperVisibility && (
                    <Box
                    sx={{
                        marginTop: '1rem',
                        textAlign: 'left'
                    }}
                    >
                    {helper.keywordNotEmpty ? (
                        <>
                        {helper.keywordInTitle
                        ? renderHelper(helper.keywordInTitle, `The focus keyword "${keyword}" appears in the Page Title`, () => 'green')
                        : renderHelper(helper.keywordInTitle, `The focus keyword "${keyword}" doesn't appear in the Page Title`, () => 'red')}
                        {helper.keywordAtBeginning
                        ? renderHelper(helper.keywordAtBeginning, "Focus keyword appears at the beginning of the Page Title", () => 'green')
                        : renderHelper(helper.keywordAtBeginning, "Put the focus keyword at the beginning of Page Title", () => 'red')}
                        {helper.titleTooLong
                        ? renderHelper(false, `The Page Title is too long. Remove ${pageTitle.length - 60} characters.`, () => 'red')
                        : helper.titleGreat
                        ? renderHelper(true, `The Page Title is great! ${60 - pageTitle.length} characters available. (${pageTitle.length} of 60 characters used)`, () => 'green')
                        : helper.titleSufficient
                        ? renderHelper(true, `The Page Title is sufficient! ${60 - pageTitle.length} characters available. (${pageTitle.length} of 60 characters used)`, () => 'yellow')
                        : renderHelper(false, `The Page Title is too short, ${60 - pageTitle.length} characters available. (${pageTitle.length} of 60 characters used)`, () => 'red')}
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                        <Box
                        sx={{
                            minWidth: 16,
                            minHeight: 16,
                            width: 16,
                            height: 16,
                            marginRight: '0.5rem',
                            backgroundColor: 'red',
                            borderRadius: '50%',
                        }}
                        />
                        <Typography variant="body2">Please enter focus keyword into the Keyword field at the start of the form (Enter focus keyword).</Typography>
                        </Box>
                    )}
                    </Box>
                )}
                </Box>

                <Box
                sx={{
                    width: '100%',
                    marginBottom: '1rem',
                }}
                >
                <TextField
                label="3. Enter Meta Description"
                variant="outlined"
                value={metaDescription}
                fullWidth
                multiline
                rows={4}
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    style: { paddingLeft: '5px', paddingTop: '5px' },
                }}
                onChange={handleMetaDescriptionChange}
                onFocus={() => setDescriptionHelperVisibility(true)}
                onBlur={handleDescriptionBlur}
                />

                {descriptionHelperVisibility && (
                    <Box
                    sx={{
                        marginTop: '1rem',
                        textAlign: 'left'
                    }}
                    >
                    {helper.keywordNotEmpty ? (
                        <>
                        {helper.keywordInDescription
                        ? renderHelper(helper.keywordInDescription, `The focus keyword "${keyword}" appears in the Meta description`, () => 'green')
                        : renderHelper(helper.keywordInDescription, `The focus keyword "${keyword}" doesn't appear in the Meta description`, () => 'red')}
                        {helper.descriptionLength && !helper.descriptionTooLong
                        ? renderHelper(true, `The Meta description is sufficient! ${160 - metaDescription.length} characters available. (${metaDescription.length} of 160 characters used)`, () => 'yellow')
                        : helper.descriptionTooLong
                        ? renderHelper(false, `The Meta description is too long. Remove ${metaDescription.length - 160} characters.`, () => 'green')
                        : renderHelper(false, `The Meta description is too short, ${160 - metaDescription.length} characters available. (${metaDescription.length} of 160 characters used)`, () => 'red')}
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem' }}>
                        <Box
                        sx={{
                            minWidth: 16,
                            minHeight: 16,
                            width: 16,
                            height: 16,
                            marginRight: '0.5rem',
                            backgroundColor: 'red',
                            borderRadius: '50%',
                        }}
                        />
                        <Typography variant="body2">Please enter focus keyword into the Keyword field at the start of the form (Enter focus keyword).</Typography>
                    </Box>
                    )}
                    </Box>
                )} 

                </Box>
            </Box>
            </Box>
        );
        } else if (activeMenu === 'helper') {
        return (
            <Box
                    sx={{
                        marginTop: '1rem',
                        textAlign: 'left'
                    }}
                    >

                    <Box sx={{ marginTop: '1rem', marginBottom: '1rem' }}>
                    <h4>Page Title score ({calculateTitleScore()})</h4>
                    <LinearProgress variant="determinate" value={calculateTitleScore()} />
                    </Box>

                    {
                        helper.keywordNotEmpty
                        ? renderHelper(true, `The focus keyword "${keyword}" has been set.`, () => 'green')
                        : renderHelper(false, 'No focus keyword has been set.', () => 'red')
                    }
                    {
                        (helper.keywordInTitle && helper.keywordNotEmpty)
                        ? renderHelper(helper.keywordInTitle, `The focus keyword appears in the Page Title`, () => 'green')
                        : renderHelper(false, `The focus keyword doesn't appear in the Page Title`, () => 'red')
                    }
                    {
                        (helper.keywordAtBeginning && helper.keywordNotEmpty)
                        ? renderHelper(helper.keywordAtBeginning, "Focus keyword appears at the beginning of the Page Title", () => 'green')
                        : renderHelper(false, "Put the focus keyword at the beginning of Page Title", () => 'red')
                    }
                    {
                        helper.titleTooLong
                        ? renderHelper(false, `The Page Title is too long. Remove ${pageTitle.length - 60} characters.`, () => 'red')
                        : helper.titleGreat
                        ? renderHelper(true, `The Page Title is great! ${60 - pageTitle.length} characters available. (${pageTitle.length} of 60 characters used)`, () => 'green')
                        : helper.titleSufficient
                        ? renderHelper(true, `The Page Title is sufficient! ${60 - pageTitle.length} characters available. (${pageTitle.length} of 60 characters used)`, () => 'yellow')
                        : renderHelper(false, `The Page Title is too short, ${60 - pageTitle.length} characters available. (${pageTitle.length} of 60 characters used)`, () => 'red')
                    }
                    </Box>
        );
        }
    };

    return (
        <Box sx={{ width: 370, height: '100vh', backgroundColor: '#fff', borderRight: '1px solid #ddd', padding: '1rem' }}>
        <List>
            <ListItem button selected={activeMenu === 'input'} onClick={() => setActiveMenu('input')}>
            <ListItemText primary="Input" />
            </ListItem>
            <ListItem button selected={activeMenu === 'helper'} onClick={() => setActiveMenu('helper')}>
            <ListItemText primary="SEO Optimization tips" />
            </ListItem>
        </List>
        <Box sx={{ borderBottom: '1px solid #ddd', paddingBottom: '1rem', marginBottom: '1rem' }}></Box>
        {renderContent()}
        </Box>
    );
    };

    export default SideBar;