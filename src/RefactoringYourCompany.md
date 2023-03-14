# Request for comment

At present, we have `YourCompany` component that's called like this:

```javascript
<YourCompany class="mt-10" />
```

The `YourCompany` component calls a number of subcomponents.  Simplified it looks
like this:

```javascript
<template>
    <h1>Your Company</h1>
    <ChangeBusinessType v-if="showChangeBusinessType" />
    <NameTranslation v-if="isAlterationFiling || isBenBcCccUlcCorrectionFiling || isRestorationFiling" />
    <AssociationType v-if="isCoop" />
    <NatureOfBusiness v-if="isFirmChangeFiling || isFirmCorrectionFiling" />
    <ConversionNOB v-if="isFirmConversionFiling" />
    <OfficeAddresses />
    <BusinessContactInfo v-if="showBusinessContactInformation" />
    <FolioInformation v-if="isPremiumAccount && !isFirm" />
</template>
```

