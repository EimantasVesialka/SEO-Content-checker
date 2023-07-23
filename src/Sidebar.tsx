import React, { useState } from "react";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Box,
  Typography,
  LinearProgress,
} from "@mui/material";

interface SideBarProps {
  textAreaValue: string;
}

const SideBar: React.FC<SideBarProps> = ({ textAreaValue }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>("input");
  const [keyword, setKeyword] = useState<string>("");
  const [pageTitle, setPageTitle] = useState<string>("");
  const [metaDescription, setMetaDescription] = useState<string>("");
  const [titleHelperVisibility, setTitleHelperVisibility] =
    useState<boolean>(false);
  const [descriptionHelperVisibility, setDescriptionHelperVisibility] =
    useState<boolean>(false);

  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const handlePageTitleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageTitle(event.target.value);
  };

  const handleMetaDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMetaDescription(event.target.value);
  };

  const handleTitleBlur = () => {
    setTitleHelperVisibility(false);
  };

  const handleDescriptionBlur = () => {
    setDescriptionHelperVisibility(false);
  };

  const calculateKeywordDensity = (content: string, keyword: string) => {
    const words = content.split(" ").filter(Boolean);
    const keywordMatches = words.filter(
      (word) => word.toLowerCase() === keyword.toLowerCase()
    ).length;

    return (keywordMatches / words.length) * 100;
  };

  const checkImageNames = (content: string, keyword: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const imageElements = Array.from(doc.getElementsByTagName("img"));

    return imageElements.some((img) => new RegExp(keyword, "i").test(img.src));
  };

  const checkImageAltText = (content: string, keyword: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const imageElements = Array.from(doc.getElementsByTagName("img"));

    return imageElements.some((img) =>
      new RegExp(`\\b${keyword}\\b`, "i").test(img.alt)
    );
  };

  let textWithoutHTML = textAreaValue.replace(/(<([^>]+)>)/gi, "");
  let wordsArray = textWithoutHTML.split(/\s+/).filter(Boolean);
  let wordCount = wordsArray.length;
  const h1Check = /<h1>(\S*?)<\/h1>/i.exec(textAreaValue);
  const keywordInH1 =
    h1Check &&
    new RegExp(`\\b${keyword.toLowerCase()}\\b`, "i").test(
      h1Check[1].toLowerCase()
    );
  const keywordInFirstParagraph = new RegExp(
    `<p[^>]*>\\s*${keyword.toLowerCase()}`
  ).test(textAreaValue.toLowerCase());
  const imgCheck = /<\s*img/.test(textAreaValue);
  const imgAltRegex = checkImageAltText(textAreaValue, keyword);
  const linkCheck = /<\s*a/.test(textAreaValue);
  const keywordDensity = calculateKeywordDensity(textWithoutHTML, keyword);
  const keywordInImgName = checkImageNames(textAreaValue, keyword);
  const desiredMinDensity = 1;
  const desiredMaxDensity = 2;
  const keywordOccurrences = (
    textWithoutHTML.match(new RegExp(`\\b${keyword}\\b`, "gi")) || []
  ).length;
  const actualDensity = (keywordOccurrences / wordCount) * 100;

  const helper = {
    keywordNotEmpty: keyword !== "",
    keywordInTitle:
      keyword !== "" && pageTitle.toLowerCase().includes(keyword.toLowerCase()),
    keywordAtBeginning:
      keyword !== "" &&
      pageTitle.toLowerCase().startsWith(keyword.toLowerCase()),
    titleSufficient: pageTitle.length >= 30,
    titleGreat: pageTitle.length >= 50,
    titleTooLong: pageTitle.length > 60,
    descriptionSufficient: metaDescription.length >= 50,
    descriptionGreat: metaDescription.length > 100,
    descriptionTooLong: metaDescription.length > 160,
    keywordInDescription:
      keyword !== "" &&
      metaDescription.toLowerCase().includes(keyword.toLowerCase()),
    h1Exists: h1Check !== null,
    keywordInH1: keywordInH1,
    textExists: textWithoutHTML !== "",
    sufficientWordCount: wordCount >= 300,
    keywordInFirstParagraph: keywordInFirstParagraph,
    optimalKeywordDensity: keywordDensity > 2,
    imgExists: imgCheck,
    keywordInImgName: keywordInImgName,
    keywordInImgAlt: imgAltRegex,
    linkExists: linkCheck,
  };

  const calculateDescriptionScore = () => {
    let score = 0;
    if (helper.keywordNotEmpty) score += 25;
    if (helper.keywordInDescription) score += 25;
    if (helper.descriptionSufficient) {
      if (helper.descriptionGreat) score += 50;
      else score += 25;
    }
    return score;
  };

  const calculateTitleScore = () => {
    let score = 0;
    if (helper.keywordInTitle) score += 25;
    if (helper.keywordAtBeginning) score += 25;
    if (helper.titleSufficient) {
      if (helper.titleGreat) score += 50;
      else score += 25;
    }
    return score;
  };

  const calculateContentScore = () => {
    let score = 0;
    score += helper.h1Exists ? 10 : 0;
    score += helper.keywordInH1 ? 15 : 0;
    score += helper.textExists ? 5 : 0;
    score += helper.sufficientWordCount ? 5 : 0;
    score += helper.keywordInFirstParagraph ? 10 : 0;
    score += helper.optimalKeywordDensity ? 15 : 0;
    score += helper.imgExists ? 10 : 0;
    score += helper.keywordInImgName ? 10 : 0;
    score += helper.keywordInImgAlt ? 10 : 0;
    score += helper.linkExists ? 10 : 0;
    return score;
  };
  const renderHelper = (
    check: boolean,
    label: string,
    colorFn: () => string
  ) => {
    return (
      <Box sx={{ display: "flex", alignItems: "center", marginTop: "0.5rem" }}>
        <Box
          sx={{
            minWidth: 16,
            minHeight: 16,
            width: 16,
            height: 16,
            marginRight: "0.5rem",
            backgroundColor: colorFn(),
            borderRadius: "50%",
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
        let words = trimmedTitle.split(" ");
        words.pop();
        trimmedTitle = words.join(" ");
      }
      trimmedTitle = trimmedTitle + "...";
    }

    return trimmedTitle;
  };

  const formatDescription = (description: string) => {
    const maxLength = 158;
    let trimmedDescription = description;

    if (trimmedDescription.length > maxLength) {
      while (trimmedDescription.length > maxLength) {
        let words = trimmedDescription.split(" ");
        words.pop();
        trimmedDescription = words.join(" ");
      }
      trimmedDescription = trimmedDescription + "...";
    }

    return trimmedDescription;
  };

  const renderContent = () => {
    if (activeMenu === "input") {
      return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{ marginTop: "2rem" }}>
            <TextField
              label="1. Enter focus keyword"
              variant="outlined"
              value={keyword}
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ style: { paddingLeft: "15px" } }}
              onChange={handleKeywordChange}
            />
            <Box
              sx={{
                width: "100%",
                borderBottom: "1px dashed #aaa",
                paddingTop: "10px",
                marginTop: "15px",
                marginBottom: "15px",
              }}
            />
          </Box>

          <Box sx={{ display: "flex" }}>
            <Tooltip placement="top" title="Google Search result preview">
              <img
                height="50"
                width="50"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/800px-Google_%22G%22_Logo.svg.png"
                alt="Google logo"
                style={{ marginRight: "1rem" }}
              />
            </Tooltip>
            <h3>Google Preview</h3>
          </Box>

          <Box
            sx={{
              backgroundColor: "#f8f8f8",
              padding: "1rem",
              marginTop: "1rem",
              borderRadius: "8px",
              textAlign: "left",
            }}
          >
            <Typography
              variant="body2"
              component="div"
              color="text.secondary"
              gutterBottom
              sx={{ fontSize: "13px" }}
            >
              {"example.com > sample-url"}
            </Typography>
            <Typography
              variant="h6"
              component="div"
              gutterBottom
              sx={{ color: "#1967D2", wordWrap: "break-word" }}
            >
              {pageTitle
                ? formatTitle(pageTitle)
                : "This is an Example page Title"}
            </Typography>
            <Typography
              variant="body2"
              component="div"
              color="text.secondary"
              sx={{ fontSize: "14px", wordWrap: "break-word" }}
            >
              {metaDescription
                ? formatDescription(metaDescription)
                : "Use the input fields to write a custom page Title and Meta description. This preview box shows you how your page will look in the search results from Google."}
            </Typography>
          </Box>

          <Box sx={{ marginTop: "2rem" }}>
            <Box
              sx={{
                width: "100%",
                marginBottom: "1rem",
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
                    marginTop: "1rem",
                    textAlign: "left",
                  }}
                >
                  {helper.keywordNotEmpty ? (
                    <>
                      {helper.keywordInTitle
                        ? renderHelper(
                            helper.keywordInTitle,
                            `The focus keyword "${keyword}" appears in the Page Title`,
                            () => "green"
                          )
                        : renderHelper(
                            helper.keywordInTitle,
                            `The focus keyword "${keyword}" doesn't appear in the Page Title`,
                            () => "red"
                          )}
                      {helper.keywordAtBeginning
                        ? renderHelper(
                            helper.keywordAtBeginning,
                            "Focus keyword appears at the beginning of the Page Title",
                            () => "green"
                          )
                        : renderHelper(
                            helper.keywordAtBeginning,
                            "Put the focus keyword at the beginning of Page Title",
                            () => "red"
                          )}
                      {helper.titleTooLong
                        ? renderHelper(
                            false,
                            `The Page Title is too long. Remove ${
                              pageTitle.length - 60
                            } characters.`,
                            () => "red"
                          )
                        : helper.titleGreat
                        ? renderHelper(
                            true,
                            `The Page Title length is great! ${
                              60 - pageTitle.length
                            } characters available. (${
                              pageTitle.length
                            } of 60 characters used)`,
                            () => "green"
                          )
                        : helper.titleSufficient
                        ? renderHelper(
                            true,
                            `The Page Title length is sufficient! ${
                              60 - pageTitle.length
                            } characters available. (${
                              pageTitle.length
                            } of 60 characters used)`,
                            () => "yellow"
                          )
                        : renderHelper(
                            false,
                            `The Page Title is too short, ${
                              60 - pageTitle.length
                            } characters available. (${
                              pageTitle.length
                            } of 60 characters used)`,
                            () => "red"
                          )}
                    </>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "0.5rem",
                      }}
                    >
                      <Box
                        sx={{
                          minWidth: 16,
                          minHeight: 16,
                          width: 16,
                          height: 16,
                          marginRight: "0.5rem",
                          backgroundColor: "red",
                          borderRadius: "50%",
                        }}
                      />
                      <Typography variant="body2">
                        Please enter focus keyword into the Keyword field at the
                        start of the form (Enter focus keyword).
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>

            <Box
              sx={{
                width: "100%",
                marginBottom: "1rem",
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
                  style: { paddingLeft: "5px", paddingTop: "5px" },
                }}
                onChange={handleMetaDescriptionChange}
                onFocus={() => setDescriptionHelperVisibility(true)}
                onBlur={handleDescriptionBlur}
              />

              {descriptionHelperVisibility && (
                <Box
                  sx={{
                    marginTop: "1rem",
                    textAlign: "left",
                  }}
                >
                  {helper.keywordNotEmpty ? (
                    <>
                      {helper.keywordInDescription
                        ? renderHelper(
                            helper.keywordInDescription,
                            `The focus keyword "${keyword}" appears in the Meta description`,
                            () => "green"
                          )
                        : renderHelper(
                            helper.keywordInDescription,
                            `The focus keyword "${keyword}" doesn't appear in the Meta description`,
                            () => "red"
                          )}
                      {helper.descriptionTooLong
                        ? renderHelper(
                            false,
                            `The Meta Description is too long. Remove ${
                              metaDescription.length - 160
                            } characters.`,
                            () => "red"
                          )
                        : helper.descriptionGreat
                        ? renderHelper(
                            true,
                            `The Meta Description length is great! ${
                              160 - metaDescription.length
                            } characters available. (${
                              metaDescription.length
                            } of 160 characters used)`,
                            () => "green"
                          )
                        : helper.descriptionSufficient
                        ? renderHelper(
                            true,
                            `The Meta Description length is sufficient! ${
                              160 - metaDescription.length
                            } characters available. (${
                              metaDescription.length
                            } of 160 characters used)`,
                            () => "yellow"
                          )
                        : renderHelper(
                            false,
                            `The Meta Description is too short, ${
                              160 - metaDescription.length
                            } characters available. (${
                              metaDescription.length
                            } of 160 characters used)`,
                            () => "red"
                          )}
                    </>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "0.5rem",
                      }}
                    >
                      <Box
                        sx={{
                          minWidth: 16,
                          minHeight: 16,
                          width: 16,
                          height: 16,
                          marginRight: "0.5rem",
                          backgroundColor: "red",
                          borderRadius: "50%",
                        }}
                      />
                      <Typography variant="body2">
                        Please enter focus keyword into the Keyword field at the
                        start of the form (Enter focus keyword).
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      );
    } else if (activeMenu === "helper") {
      return (
        <Box
          sx={{
            marginTop: "1rem",
            textAlign: "left",
          }}
        >
          <Box sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <h4>Page Title score ({calculateTitleScore()})</h4>
            <LinearProgress
              variant="determinate"
              value={calculateTitleScore()}
            />
          </Box>

          {helper.keywordNotEmpty
            ? renderHelper(
                true,
                `The focus keyword "${keyword}" has been set.`,
                () => "green"
              )
            : renderHelper(
                false,
                "No focus keyword has been set.",
                () => "red"
              )}
          {helper.keywordInTitle && helper.keywordNotEmpty
            ? renderHelper(
                helper.keywordInTitle,
                `The focus keyword appears in the Page Title`,
                () => "green"
              )
            : renderHelper(
                false,
                `The focus keyword doesn't appear in the Page Title`,
                () => "red"
              )}
          {helper.keywordAtBeginning && helper.keywordNotEmpty
            ? renderHelper(
                helper.keywordAtBeginning,
                "Focus keyword appears at the beginning of the Page Title",
                () => "green"
              )
            : renderHelper(
                false,
                "Put the focus keyword at the beginning of Page Title",
                () => "red"
              )}
          {helper.titleTooLong
            ? renderHelper(
                false,
                `The Page Title is too long. Remove ${
                  pageTitle.length - 60
                } characters.`,
                () => "red"
              )
            : helper.titleGreat
            ? renderHelper(
                true,
                `The Page Title length is great! ${
                  60 - pageTitle.length
                } characters available. (${
                  pageTitle.length
                } of 60 characters used)`,
                () => "green"
              )
            : helper.titleSufficient
            ? renderHelper(
                true,
                `The Page Title length is sufficient! ${
                  60 - pageTitle.length
                } characters available. (${
                  pageTitle.length
                } of 60 characters used)`,
                () => "yellow"
              )
            : renderHelper(
                false,
                `The Page Title is too short, ${
                  60 - pageTitle.length
                } characters available. (${
                  pageTitle.length
                } of 60 characters used)`,
                () => "red"
              )}

          <Box sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <h4>Meta Description score ({calculateDescriptionScore()})</h4>
            <LinearProgress
              variant="determinate"
              value={calculateDescriptionScore()}
            />
          </Box>

          {helper.keywordNotEmpty
            ? renderHelper(
                true,
                `The focus keyword "${keyword}" has been set.`,
                () => "green"
              )
            : renderHelper(
                false,
                "No focus keyword has been set.",
                () => "red"
              )}

          {helper.keywordInDescription && helper.keywordNotEmpty
            ? renderHelper(
                helper.keywordInTitle,
                `The focus keyword appears in the Meta Description`,
                () => "green"
              )
            : renderHelper(
                false,
                `The focus keyword doesn't appear in the Meta Description`,
                () => "red"
              )}

          {helper.descriptionTooLong
            ? renderHelper(
                false,
                `The Meta Description is too long. Remove ${
                  metaDescription.length - 160
                } characters.`,
                () => "red"
              )
            : helper.descriptionGreat
            ? renderHelper(
                true,
                `The Meta Description length is great! ${
                  160 - metaDescription.length
                } characters available. (${
                  metaDescription.length
                } of 160 characters used)`,
                () => "green"
              )
            : helper.descriptionSufficient
            ? renderHelper(
                true,
                `The Meta Description length is sufficient! ${
                  160 - metaDescription.length
                } characters available. (${
                  metaDescription.length
                } of 160 characters used)`,
                () => "yellow"
              )
            : renderHelper(
                false,
                `The Meta Description is too short, ${
                  160 - metaDescription.length
                } characters available. (${
                  metaDescription.length
                } of 160 characters used)`,
                () => "red"
              )}

          <Box sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
            <h4>Content score ({calculateContentScore()})</h4>
            <LinearProgress
              variant="determinate"
              value={calculateContentScore()}
            />
          </Box>

          {h1Check
            ? renderHelper(true, `You've added a H1. Good job!`, () => "green")
            : renderHelper(
                false,
                "You should add a H1 tag to your content.",
                () => "red"
              )}

          {keywordInH1
            ? renderHelper(
                true,
                `The focus keyword '${keyword}' appears in the H1!`,
                () => "green"
              )
            : renderHelper(
                false,
                `The focus keyword doesn't appear in H1`,
                () => "red"
              )}

          {textWithoutHTML !== ""
            ? renderHelper(
                true,
                `You've added text to your content.`,
                () => "green"
              )
            : renderHelper(
                false,
                "Your content does not contain any text.",
                () => "red"
              )}

          {wordCount >= 300
            ? renderHelper(
                true,
                `Your text contains ${wordCount} words, which is above the recommended minimum of 300.`,
                () => "green"
              )
            : renderHelper(
                false,
                `Your text contains ${wordCount} words. Add more content to reach the recommended minimum of 300 words.`,
                () => "red"
              )}

          {keywordInFirstParagraph && textWithoutHTML !== ""
            ? renderHelper(
                true,
                `Your first paragraph contains the keyword '${keyword}'.`,
                () => "green"
              )
            : renderHelper(
                false,
                `Your first paragraph does not contain the focused keyword. Consider adding it for better SEO.`,
                () => "red"
              )}

          {imgCheck
            ? renderHelper(
                true,
                `Your text contains image tags, which is good for SEO.`,
                () => "green"
              )
            : renderHelper(
                false,
                `Your text does not contain any image tags. Consider adding some for better SEO.`,
                () => "red"
              )}

          {keywordInImgName
            ? renderHelper(
                true,
                `Your images have alt attributes that contain the keyword '${keyword}', which is good for SEO.`,
                () => "green"
              )
            : renderHelper(
                false,
                `Your images do not have alt attributes containing the focused keyword. Consider adding them for better SEO.`,
                () => "red"
              )}

          {linkCheck
            ? renderHelper(
                true,
                `Your text contains links, which is good for SEO.`,
                () => "green"
              )
            : renderHelper(
                false,
                `Your text does not contain any links. Consider adding some for better SEO.`,
                () => "red"
              )}

          {wordCount > 0 &&
          actualDensity >= desiredMinDensity &&
          actualDensity <= desiredMaxDensity
            ? renderHelper(
                true,
                `The keyword '${keyword}' is used ${keywordOccurrences} times, maintaining a keyword density of ${actualDensity.toFixed(
                  2
                )}%. This is within the optimal range of ${desiredMinDensity}% - ${desiredMaxDensity}%.`,
                () => "green"
              )
            : wordCount > 0 && actualDensity < desiredMinDensity
            ? renderHelper(
                false,
                `The keyword '${keyword}' is only used ${keywordOccurrences} times, resulting in a keyword density of ${actualDensity.toFixed(
                  2
                )}%. For better SEO, try to use it more frequently to reach the desired keyword density range of ${desiredMinDensity}% - ${desiredMaxDensity}%.`,
                () => "red"
              )
            : wordCount > 0 && actualDensity > desiredMaxDensity
            ? renderHelper(
                false,
                `The keyword '${keyword}' is used ${keywordOccurrences} times, resulting in a keyword density of ${actualDensity.toFixed(
                  2
                )}%. This is above the optimal range and could lead to keyword stuffing. Try to reduce the usage of the keyword to maintain a density within the range of ${desiredMinDensity}% - ${desiredMaxDensity}%.`,
                () => "red"
              )
            : renderHelper(
                false,
                `There are no words in the text. Please add content.`,
                () => "red"
              )}

          {keywordInImgName
            ? renderHelper(
                true,
                `Your images' filenames contain the keyword '${keyword}', which is good for SEO.`,
                () => "green"
              )
            : renderHelper(
                false,
                `Your images' filenames do not contain the focused keyword. Consider renaming them for better SEO.`,
                () => "red"
              )}
        </Box>
      );
    }
  };

  return (
    <Box
      sx={{
        width: 370,
        height: "100vh",
        backgroundColor: "#fff",
        borderRight: "1px solid #ddd",
        padding: "1rem",
      }}
    >
      <List>
        <ListItem
          button
          selected={activeMenu === "input"}
          onClick={() => setActiveMenu("input")}
        >
          <ListItemText primary="Input" />
        </ListItem>
        <ListItem
          button
          selected={activeMenu === "helper"}
          onClick={() => setActiveMenu("helper")}
        >
          <ListItemText primary="SEO Optimization tips" />
        </ListItem>
      </List>
      <Box
        sx={{
          borderBottom: "1px solid #ddd",
          paddingBottom: "1rem",
          marginBottom: "1rem",
        }}
      ></Box>
      {renderContent()}
    </Box>
  );
};

export default SideBar;
