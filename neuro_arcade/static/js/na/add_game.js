$(document).ready(function() {
    $('#add-type').click(function() {
            var nextId = parseInt($('#id_form-TOTAL_FORMS').val());
            $('#scoretypes').append(
                $('#empty-scoretype').html().replace(/__prefix__/g, nextId)
            );
            $('#id_form-TOTAL_FORMS').val(nextId + 1);
    });
});
