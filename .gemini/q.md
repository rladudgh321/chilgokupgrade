Console Error

Cannot update a component (`CreateClient`) while rendering a different component (`SaveImage`). To locate the bad setState() call inside `SaveImage`, follow the stack trace as described in https://react.dev/link/setstate-in-render

src/app/(admin)/admin/listings/(menu)/listings/shared/SaveImage.tsx (100:11) @ SaveImage.useMutation[propertyImagesMutation]


   98 |         const curr = Array.isArray(getValues("subImage")) ? getValues("subImage")! : [];
   99 |         if (!arraysEqual(next, curr)) {
> 100 |           setValue("subImage", next, { shouldDirty: true });
      |           ^
  101 |         }
  102 |         return next;
  103 |       });
Call Stack
31

Show 26 ignore-listed frame(s)
SaveImage.useMutation[propertyImagesMutation]
src/app/(admin)/admin/listings/(menu)/listings/shared/SaveImage.tsx (100:11)
SaveImage
src/app/(admin)/admin/listings/(menu)/listings/shared/SaveImage.tsx (44:55)
BuildForm
src/app/(admin)/admin/listings/(menu)/listings/shared/BuildForm.tsx (267:11)
CreateClient
src/app/(admin)/admin/listings/(menu)/listings/create/CreateClient.tsx (93:5)
CreateListings
src\app\(admin)\admin\listings\(menu)\listings\create\page.tsx (7:7)