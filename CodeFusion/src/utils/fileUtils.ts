export const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (files) {
    const fileListItems = document.getElementById("fileListItems");
    if (fileListItems) {
      fileListItems.innerHTML = "";
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const listItem = document.createElement("li");
        listItem.textContent = file.name;
        fileListItems.appendChild(listItem);
      }
    }
  }
};

export const handleDirectoryUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (files) {
    const fileListItems = document.getElementById("fileListItems");
    if (fileListItems) {
      fileListItems.innerHTML = "";
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const listItem = document.createElement("li");
        listItem.textContent = file.webkitRelativePath || file.name;
        fileListItems.appendChild(listItem);
      }
    }
  }
};

export const filterFiles = (files: FileList, acceptedTypes: string[]) => {
  const acceptedFiles: File[] = [];
  const skippedFiles: File[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (fileExtension && acceptedTypes.includes(`.${fileExtension}`)) {
      acceptedFiles.push(file);
    } else {
      skippedFiles.push(file);
    }
  }

  return { acceptedFiles, skippedFiles };
};

export const readFileContent = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      resolve(content);
    };

    reader.onerror = (event) => {
      reject(event);
    };

    reader.readAsText(file);
  });
};