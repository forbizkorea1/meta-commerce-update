/**
 * Created by forbiz on 2019-05-21.
 */
const member_searchId = () => {
    const $document = $(document);

    $document.on("change", "input[name=memType]", function() {
        const cont_normal = $('#tab01');
        const cont_company = $('#tab02');

        var radioVal = $(":input:radio[name=memType]:checked").val();

        if(radioVal == 'normal') {
            cont_company.hide();
            cont_normal.show();
        } else if(radioVal == 'company') {        
            cont_normal.hide();
            cont_company.show();
        }
    })
    
}

export default member_searchId;