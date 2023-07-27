import { useState } from "react";

export const useSidebarUtils = () => {
  // Setting up state variables
  const [activeMenu, setActiveMenu] = useState<string | null>("input");
  const [keyword, setKeyword] = useState<string>("");
  const [pageTitle, setPageTitle] = useState<string>("");
  const [metaDescription, setMetaDescription] = useState<string>("");
  const [titleHelperVisibility, setTitleHelperVisibility] =
    useState<boolean>(false);
  const [descriptionHelperVisibility, setDescriptionHelperVisibility] =
    useState<boolean>(false);

  // Function to handle changes at input fields
  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value);
    };

  // Handlers for each input field
  const handleKeywordChange = handleChange(setKeyword);
  const handlePageTitleChange = handleChange(setPageTitle);
  const handleMetaDescriptionChange = handleChange(setMetaDescription);

  // Handler when user focuses outside the title input
  const handleTitleBlur = () => {
    setTitleHelperVisibility(false);
  };

  // Handler when user focuses outside the description input
  const handleDescriptionBlur = () => {
    setDescriptionHelperVisibility(false);
  };

  // Function for keyword density calculation
  const calculateKeywordDensity = (content: string, keyword: string) => {
    const words = content.split(" ").filter(Boolean);
    const keywordMatches = words.filter(
      (word) => word.toLowerCase() === keyword.toLowerCase()
    ).length;

    return (keywordMatches / words.length) * 100;
  };

  // Function for img name checking
  const checkImageNames = (content: string, keyword: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const imageElements = Array.from(doc.getElementsByTagName("img"));

    return imageElements.some((img) => new RegExp(keyword, "i").test(img.src));
  };

  // Function for img alt text checking
  const checkImageAltText = (content: string, keyword: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const imageElements = Array.from(doc.getElementsByTagName("img"));

    return imageElements.some((img) =>
      new RegExp(`\\b${keyword}\\b`, "i").test(img.alt)
    );
  };

  // Function to format title
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

  // Function to format description
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

  // Return the state variables and functions that we'll use in Sidebar
  return {
    activeMenu,
    setActiveMenu,
    keyword,
    pageTitle,
    metaDescription,
    titleHelperVisibility,
    setTitleHelperVisibility,
    descriptionHelperVisibility,
    setDescriptionHelperVisibility,
    handleKeywordChange,
    handlePageTitleChange,
    handleMetaDescriptionChange,
    handleTitleBlur,
    handleDescriptionBlur,
    calculateKeywordDensity,
    checkImageNames,
    checkImageAltText,
    formatTitle,
    formatDescription,
  };
};
