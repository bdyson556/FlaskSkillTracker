function makeEditable(cell) {
<!--            cell.contentEditable = true;-->
            cell.classList.add('editable');
            cell.focus();
            cell.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    saveEdit(cell, cell.dataset.column, cell.dataset.Skill);
                }
            });
        }

function saveEdit(cell, column, Skill) {
<!--            cell.contentEditable = false;-->
    var newValue = cell.innerText;
    cell.classList.remove('editable');
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/update_Skill", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({
        "Skill": Skill,
        "column": column,
        "new_value": newValue
    }));
    xhr.onload = function() {
        if (xhr.status != 200) {
            alert("Error updating value.");
        }
    };
}
<!--        document.addEventListener('DOMContentLoaded', function() {-->
<!--            document.querySelectorAll('[contenteditable="true"]').forEach(function(cell) {-->
<!--                cell.addEventListener('keydown', function(event) {-->
<!--                    if (event.key === 'Enter') {-->
<!--                        event.preventDefault();-->
<!--                        saveEdit(cell, cell.dataset.column, cell.dataset.Skill);-->
<!--                    }-->
<!--                });-->
<!--            });-->
<!--        });-->
$(document).ready(function() {
    $('[contenteditable="true"]').on('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            saveEdit(this, $(this).data('column'), $(this).data('Skill'));
        }
    });

    $('.dummy-button').on('click', function() {
        console.log('Dummy button clicked');
        var $button = $(this);
        var $row = $button.closest('tr');
        var $detailsRow = $row.next('.details-row');
        if ($detailsRow.length === 0) {
            var Skill = $row.find('td').eq(1).text();
            console.log('Fetching details for skill:', Skill);
            $.get('/get_skill_details', { Skill: Skill }, function(data) {
                console.log('Data received:', data);
                var detailsHtml = `
                    <tr class="details-row">
                        <td colspan="4">
                            <div class="details-container">
                                <h3>Edit Details for ${data.Skill}</h3>
                                <label>Original Name: <input type="hidden" value="${data.Skill}" data-column="OriginalSkill" data-skill="${data.Skill}"></label>
                                <label>Name: <input type="text" value="${data.Skill}" data-column="Skill" data-Skill="${data.Skill}"></label>
                                <label>Level: <input type="text" value="${data.Level}" data-column="Level" data-Skill="${data.Skill}"></label>
                                <label>Priority: <input type="text" value="${data.Priority}" data-column="Priority" data-Skill="${data.Skill}"></label>
                                <label>Notes: <textarea data-column="Notes" data-Skill="${data.Skill}">${data.Notes}</textarea></label>
                                <label>Tags: <input type="text" value="${data.Tags}" data-column="Tags" data-Skill="${data.Skill}"></label>
                                <button onclick="saveDetails(this)">Save</button>
                            </div>
                        </td>
                    </tr>`;
                console.log('Appending details HTML:', detailsHtml);
                $row.after(detailsHtml);
                $detailsRow = $row.next('.details-row');
                $detailsRow.slideToggle();
            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.log('Failed to fetch details for skill:');
                console.log('Error:', textStatus, errorThrown);
                console.log('Response:', jqXHR.responseText);
            });
        } else {
            console.log('Toggling existing details row');
            $detailsRow.slideToggle();
        }
    });
});

function saveDetails(button) {
    var $inputs = $(button).closest('.details-container').find('input, textarea');
    var updatedData = {};
    $inputs.each(function() {
        var $input = $(this);
        var column = $input.data('column');
        var Skill = $input.data('Skill');
        var newValue = $input.val();
        updatedData[column] = newValue;
        var cell = $('[data-Skill="' + Skill + '"][data-column="' + column + '"]');
        cell.text(newValue);
    });
    updatedData['Skill'] = $inputs.filter('[data-column="Skill"]').val();

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/update_skill_details", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    console.log(updatedData);
<!--            GETTING STUCK HERE. Just hanging... ?     -->
    xhr.send(JSON.stringify(updatedData));
    xhr.onload = function() {
        if (xhr.status == 200) {
            alert("Details updated successfully!");
        } else {
            alert("Error updating details.");
        }
    };
}