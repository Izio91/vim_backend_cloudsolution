const { formatDateFromFunctionToString, formatTimeToString } = require('./utils/utilities');

"use strict";

module.exports = async (request, tx) => {
    // Extract PackageId from request query parameters
    const { References } = request.data.payload;
    if (!References || References.length === 0) {
        // Return error response if Supplier is not provided
        return { status: 400, message: 'Bad Request' };
    }
    const serviceS4_HANA = await cds.connect.to(process.env['Destination_OData_S4HANA']);
    const serviceRequestS4_HANA = serviceS4_HANA.tx(request);
    var aReferencesFilters = References.map((sReference) => "ReferenceDocument  eq '"+sReference+"'");
    var sReferenceFilters = aReferencesFilters.join(" or ");
    var oResultDeliveryNoteRefRequest = [];
    
    oResultDeliveryNoteRefRequest = await serviceRequestS4_HANA.get(process.env['Path_YY1_MATERIALDOCUMENTS3_CDS']+"&$filter="+sReferenceFilters);
    
    
    oResultDeliveryNoteRefRequest.forEach((result) => {
        if (result.CreationDate) {
            result.DocumentDate = formatDateFromFunctionToString(result.DocumentDate); 
            result.PostingDate = formatDateFromFunctionToString(result.PostingDate); 
            result.CreationDate = formatDateFromFunctionToString(result.CreationDate); 
        }
    });
    
    return { status: 200, result: oResultDeliveryNoteRefRequest, message: 'Executed' };
};